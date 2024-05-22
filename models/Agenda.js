import mongoose from "mongoose";
import { Schema } from "mongoose";

const Agenda = mongoose.model('Agenda', new Schema({

    name: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    day: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['Novo', 'Aberto', 'Atendendo', 'Finalizado'],
        default: 'Novo',
        required: true
    }
}))

export default Agenda