import Comments from "../models/CommentModel.js";
import Biodata from "../models/BiodataModel.js";

// --- PUBLIC: AMBIL KOMENTAR ---
export const getComments = async(req, res) => {
    try {
        const response = await Comments.findAll({
            where: { biodataId: req.params.biodataId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

// --- PUBLIC: KIRIM KOMENTAR ---
export const createComment = async(req, res) => {
    const { nama_pelapor, isi_laporan, biodataUuid } = req.body;
    try {
        const recipient = await Biodata.findOne({ where: { uuid: biodataUuid } });
        if(!recipient) return res.status(404).json({msg: "Data penerima tidak ditemukan"});

        await Comments.create({
            nama_pelapor: nama_pelapor || "Warga (Anonim)",
            isi_laporan: isi_laporan,
            biodataId: recipient.id
        });
        res.status(201).json({msg: "Laporan berhasil dikirim"});
    } catch (error) {
        res.status(400).json({msg: error.message});
    }
}
