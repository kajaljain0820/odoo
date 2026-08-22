import { Trip, ItinerarySection, Activity, User } from '../models/index.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

const buildTripResponse = (trip) => {
  const totalBudget = parseFloat(trip.budget || 0);
  const totalExpense = (trip.activities || []).reduce((sum, act) => sum + parseFloat(act.expense || 0), 0);

  const todayStr = new Date().toISOString().split('T')[0];
  let status = 'Upcoming';
  if (trip.start_date <= todayStr && trip.end_date >= todayStr) {
    status = 'Ongoing';
  } else if (trip.end_date < todayStr) {
    status = 'Completed';
  }

  return {
    ...trip,
    totalBudget,
    totalExpense,
    status
  };
};

const createShareKey = () => `trip-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// Create a new trip
export const createTrip = async (req, res) => {
  try {
    const { title, destination_place, description, cover_photo_url, start_date, end_date, budget } = req.body;
    const userId = req.user.id;

    if (!title || !destination_place || !start_date || !end_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTrip = await Trip.create({
      title,
      destination_place,
      description: description || '',
      cover_photo_url: cover_photo_url || null,
      start_date,
      end_date,
      budget: budget || 0.00,
      share_key: createShareKey(),
      userId
    });

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Server error creating trip' });
  }
};

// Get all trips for the authenticated user (with filtering, searching, and sorting)
export const getTrips = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search, sortBy, order } = req.query;

    const whereClause = { userId };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { destination_place: { [Op.like]: `%${search}%` } }
      ];
    }

    // Determine sorting options
    let orderClause = [['start_date', 'ASC']];
    if (sortBy === 'title') {
      orderClause = [['title', order === 'DESC' ? 'DESC' : 'ASC']];
    } else if (sortBy === 'start_date') {
      orderClause = [['start_date', order === 'DESC' ? 'DESC' : 'ASC']];
    } else if (sortBy === 'end_date') {
      orderClause = [['end_date', order === 'DESC' ? 'DESC' : 'ASC']];
    }

    const trips = await Trip.findAll({
      where: whereClause,
      include: [
        { model: ItinerarySection, as: 'sections' },
        { model: Activity, as: 'activities' }
      ],
      order: orderClause
    });

    for (const trip of trips) {
      if (!trip.share_key) {
        trip.share_key = createShareKey();
        await trip.save();
      }
    }

    // Format output and calculate sums
    const formattedTrips = trips.map(t => buildTripResponse(t.get({ plain: true })));

    // Special client-side sorting for budget since it is calculated dynamically
    if (sortBy === 'budget') {
      formattedTrips.sort((a, b) => {
        return order === 'DESC' ? b.totalBudget - a.totalBudget : a.totalBudget - b.totalBudget;
      });
    }

    res.json(formattedTrips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error fetching trips' });
  }
};

// Get single trip details by ID
export const getTripDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tripInstance = await Trip.findOne({
      where: { id, userId },
      include: [
        { model: ItinerarySection, as: 'sections' },
        { model: Activity, as: 'activities' }
      ],
      order: [
        [{ model: Activity, as: 'activities' }, 'day_number', 'ASC'],
        [{ model: Activity, as: 'activities' }, 'order', 'ASC']
      ]
    });

    if (!tripInstance) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (!tripInstance.share_key) {
      tripInstance.share_key = createShareKey();
      await tripInstance.save();
    }

    const trip = tripInstance.get({ plain: true });
    res.json(buildTripResponse(trip));
  } catch (error) {
    console.error('Error fetching trip details:', error);
    res.status(500).json({ message: 'Server error fetching trip details' });
  }
};

// Get public trip details by share key
export const getPublicTripDetails = async (req, res) => {
  try {
    const { shareKey } = req.params;

    const tripInstance = await Trip.findOne({
      where: { share_key: shareKey },
      include: [
        { model: ItinerarySection, as: 'sections' },
        { model: Activity, as: 'activities' },
        {
          model: User,
          as: 'user',
          attributes: ['first_name', 'last_name', 'username']
        }
      ],
      order: [
        [{ model: Activity, as: 'activities' }, 'day_number', 'ASC'],
        [{ model: Activity, as: 'activities' }, 'order', 'ASC']
      ]
    });

    if (!tripInstance) {
      return res.status(404).json({ message: 'Shared trip not found' });
    }

    const trip = tripInstance.get({ plain: true });
    res.json(buildTripResponse(trip));
  } catch (error) {
    console.error('Error fetching public trip details:', error);
    res.status(500).json({ message: 'Server error fetching shared trip details' });
  }
};

// Delete a trip
export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const trip = await Trip.findOne({ where: { id, userId } });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await trip.destroy();
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Server error deleting trip' });
  }
};

// --- Share / Public Trip ---

// Generate a unique share key for a trip (POST /trips/:id/share)
export const generateShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Generate a short unique key if not already set
    if (!trip.share_key) {
      const randomHex = crypto.randomBytes(6).toString('hex');
      trip.share_key = `trip_${id}_${randomHex}`;
      await trip.save();
    }

    res.json({ share_key: trip.share_key });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ message: 'Server error generating share link: ' + error.message });
  }
};

// Clone a public trip into the logged in user's account (POST /trips/shared/:shareKey/clone)
export const cloneTrip = async (req, res) => {
  try {
    const { shareKey } = req.params;
    const userId = req.user.id;

    const sourceTrip = await Trip.findOne({
      where: { share_key: shareKey },
      include: [
        { model: ItinerarySection, as: 'sections' },
        { model: Activity, as: 'activities' }
      ]
    });

    if (!sourceTrip) {
      return res.status(404).json({ message: 'Source trip not found' });
    }

    // Create a copy for the current user
    const newTrip = await Trip.create({
      title: `${sourceTrip.title} (Copy)`,
      destination_place: sourceTrip.destination_place,
      description: sourceTrip.description,
      cover_photo_url: sourceTrip.cover_photo_url,
      start_date: sourceTrip.start_date,
      end_date: sourceTrip.end_date,
      budget: sourceTrip.budget,
      userId
    });

    // Copy sections
    if (sourceTrip.sections && sourceTrip.sections.length > 0) {
      for (const sec of sourceTrip.sections) {
        await ItinerarySection.create({
          tripId: newTrip.id,
          title: sec.title,
          description: sec.description,
          start_date: sec.start_date,
          end_date: sec.end_date,
          budget: sec.budget
        });
      }
    }

    // Copy activities
    if (sourceTrip.activities && sourceTrip.activities.length > 0) {
      for (const act of sourceTrip.activities) {
        await Activity.create({
          tripId: newTrip.id,
          day_number: act.day_number,
          activity_name: act.activity_name,
          expense: act.expense,
          order: act.order
        });
      }
    }

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Error cloning trip:', error);
    res.status(500).json({ message: 'Server error cloning trip' });
  }
};


// --- Itinerary Section Management ---


// Add section to a trip
export const addItinerarySection = async (req, res) => {
  try {
    const { tripId, title, description, start_date, end_date, budget } = req.body;
    const userId = req.user.id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ where: { id: tripId, userId } });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const newSection = await ItinerarySection.create({
      tripId,
      title,
      description,
      start_date,
      end_date,
      budget: budget || 0.00
    });

    res.status(201).json(newSection);
  } catch (error) {
    console.error('Error adding itinerary section:', error);
    res.status(500).json({ message: 'Server error adding section' });
  }
};

// Update itinerary section
export const updateItinerarySection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, budget } = req.body;
    const userId = req.user.id;

    const section = await ItinerarySection.findByPk(id, {
      include: [{ model: Trip, as: 'trip' }]
    });

    if (!section || section.trip.userId !== userId) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.title = title || section.title;
    section.description = description !== undefined ? description : section.description;
    section.start_date = start_date !== undefined ? start_date : section.start_date;
    section.end_date = end_date !== undefined ? end_date : section.end_date;
    section.budget = budget !== undefined ? budget : section.budget;

    await section.save();
    res.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Server error updating section' });
  }
};

// Delete itinerary section
export const deleteItinerarySection = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const section = await ItinerarySection.findByPk(id, {
      include: [{ model: Trip, as: 'trip' }]
    });

    if (!section || section.trip.userId !== userId) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.destroy();
    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({ message: 'Server error deleting section' });
  }
};

// --- Daily Activities Management ---

// Add daily activity
export const addActivity = async (req, res) => {
  try {
    const { tripId, day_number, activity_name, expense, order } = req.body;
    const userId = req.user.id;

    const trip = await Trip.findOne({ where: { id: tripId, userId } });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const newActivity = await Activity.create({
      tripId,
      day_number: day_number || 1,
      activity_name,
      expense: expense || 0.00,
      order: order || 0
    });

    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ message: 'Server error adding activity' });
  }
};

// Delete daily activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const activity = await Activity.findByPk(id, {
      include: [{ model: Trip, as: 'trip' }]
    });

    if (!activity || activity.trip.userId !== userId) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    await activity.destroy();
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ message: 'Server error deleting activity' });
  }
};
