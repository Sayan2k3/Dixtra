const { supabase } = require('../db');

// GET all disasters
exports.getAllDisasters = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('disasters')
      .select('id, title, location_name, description, tags, owner_id, created_at, location')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const processed = data.map(d => {
      let lat = null, lon = null;

      if (d.location?.coordinates) {
        [lon, lat] = d.location.coordinates;
      } else if (typeof d.location === 'string') {
        const match = d.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) {
          [lon, lat] = [parseFloat(match[1]), parseFloat(match[2])];
        }
      }

      return { ...d, lat, lon };
    });

    res.json(processed);
  } catch (err) {
    console.error('❌ Error fetching disasters:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// CREATE a new disaster
exports.createDisaster = async (req, res) => {
  try {
    const { title, location_name, lat, lon, description, tags = [], owner_id } = req.body;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const { data, error } = await supabase
      .from('disasters')
      .insert([
        {
          title,
          location_name,
          description,
          tags,
          owner_id,
          location: {
            type: 'Point',
            coordinates: [parseFloat(lon), parseFloat(lat)],
          },
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('❌ Error creating disaster:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// UPDATE an existing disaster
exports.updateDisaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, location_name, lat, lon, description, tags, owner_id } = req.body;

    const updateData = {
      title,
      location_name,
      description,
      tags,
      owner_id,
    };

    if (lat != null && lon != null) {
      updateData.location = {
        type: 'Point',
        coordinates: [parseFloat(lon), parseFloat(lat)],
      };
    }

    const { data, error } = await supabase
      .from('disasters')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('❌ Error updating disaster:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE a disaster
exports.deleteDisaster = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('disasters')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send(); // No Content
  } catch (err) {
    console.error('❌ Error deleting disaster:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
