import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    
    const contacts = await Contact.find({ owner: req.user.id }); // {favorite: true}
    res.status(200).send(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });

    if (!contact) {
      throw HttpError(404);
    }
    // if (contact.owner.toString() !== req.user.id) {
    //   throw HttpError(403);
    //  }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const removedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    if (!removedContact) {
      throw HttpError(404);
    }
    return res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user.id,
    };

    const { error } = createContactSchema.validate(contact, {
      abortEarly: false,
    });
    if (error) {
      throw HttpError(400, error.message);
    }
    try {
      const newContact = await Contact.create(contact);

      res.status(201).send(newContact);
    } catch (error) {
      throw HttpError(500, error.message);
    }
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = req.body;

    if (!contact.name && !contact.email && !contact.phone) {
      return res
        .status(400)
        .json({ message: "Body must have at least one field" });
    }

    const { error, value } = updateContactSchema.validate(contact, {
      abortEarly: false,
    });

    if (error) {
      throw HttpError(400, error.message);
    }
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      req.body,  { new: true }
    );

    console.log(updatedContact);

    if (!updatedContact) {
      throw HttpError(404);
    }
    res.status(201).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedContact = await Contact.findOneAndUpdate( { _id: id, owner: req.user.id },
      req.body,  { new: true });

    if (!updatedContact) {
      throw HttpError(404);
    }
    return res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
