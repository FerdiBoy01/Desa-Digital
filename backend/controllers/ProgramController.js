import Program from "../models/ProgramModel.js";

// PUBLIC: Ambil Program yang SEDANG BUKA saja (Untuk User)
export const getActivePrograms = async(req, res) => {
    try {
        const response = await Program.findAll({
            where: { isOpen: true }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// ADMIN: Ambil SEMUA Program (Untuk Admin kelola)
export const getAllPrograms = async(req, res) => {
    try {
        const response = await Program.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// ADMIN: Tambah Program Baru
export const createProgram = async(req, res) => {
    const { nama_program, deskripsi, periode } = req.body;
    try {
        await Program.create({
            nama_program, deskripsi, periode, isOpen: true
        });
        res.status(201).json({msg: "Program Bantuan Berhasil Dibuat"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// ADMIN: Ubah Status (Buka/Tutup) atau Edit Info
export const updateProgram = async(req, res) => {
    try {
        const program = await Program.findOne({ where: { uuid: req.params.id }});
        if(!program) return res.status(404).json({msg: "Program tidak ditemukan"});

        const { nama_program, deskripsi, periode, isOpen } = req.body;
        
        await Program.update({
            nama_program, deskripsi, periode, isOpen
        }, {
            where: { uuid: req.params.id }
        });
        res.status(200).json({msg: "Program Berhasil Diupdate"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// ADMIN: Hapus Program
export const deleteProgram = async(req, res) => {
    try {
        const program = await Program.findOne({ where: { uuid: req.params.id }});
        if(!program) return res.status(404).json({msg: "Program tidak ditemukan"});
        
        await Program.destroy({ where: { uuid: req.params.id } });
        res.status(200).json({msg: "Program Berhasil Dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}