

let offers = []; // In-memory array to store offers temporarily

// Create Offer
export const createOffer = async (req, res) => {
  const { offer_code, offer_type, value, min_order_value, start_date, end_date, status, description } = req.body;

  try {
    // Check if offer already exists
    const existingOffer = offers.find(offer => offer.offer_code === offer_code);
    if (existingOffer) {
      return res.status(400).json({ message: 'Offer code already exists' });
    }

    const newOffer = {
      offer_code,
      offer_type,
      value,
      min_order_value,
      start_date,
      end_date,
      status,
      description
    };

    offers.push(newOffer); // Add the new offer to the in-memory array

    res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
  } catch (err) {
    res.status(400).json({ message: 'Error creating offer', error: err });
  }
};

// Update Offer by ID
export const updateOfferById = async (req, res) => {
  const { id } = req.params;
  const { offer_code, offer_type, value, min_order_value, start_date, end_date, status, description } = req.body;

  try {
    const offerIndex = offers.findIndex(offer => offer.offer_code === id);
    if (offerIndex === -1) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const updatedOffer = {
      ...offers[offerIndex],
      offer_code,
      offer_type,
      value,
      min_order_value,
      start_date,
      end_date,
      status,
      description
    };

    offers[offerIndex] = updatedOffer; // Update the offer in the array

    res.json({ message: 'Offer updated successfully', offer: updatedOffer });
  } catch (err) {
    res.status(400).json({ message: 'Error updating offer', error: err });
  }
};

// Get Offer by ID
export const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = offers.find(offer => offer.offer_code === id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    res.json(offer);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching offer', error: err });
  }
};

// Get All Offers
export const getAllOffers = async (req, res) => {
  try {
    res.json(offers);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching offers', error: err });
  }
};

// Apply Offer to Order
export const applyOfferToOrder = async (req, res) => {
  const { offer_code, order_value } = req.body;

  try {
    const offer = offers.find(offer => offer.offer_code === offer_code);

    if (!offer || offer.status !== 'active' || order_value < offer.min_order_value) {
      return res.status(400).json({ message: 'Offer cannot be applied.' });
    }

    const discount = offer.offer_type === 'percentage'
      ? (order_value * offer.value) / 100
      : offer.value;

    const finalOrderValue = order_value - discount;

    res.json({
      applied_discount: discount,
      final_order_value: finalOrderValue,
      message: 'Offer applied successfully.'
    });
  } catch (err) {
    res.status(400).json({ message: 'Error applying offer', error: err });
  }
};
