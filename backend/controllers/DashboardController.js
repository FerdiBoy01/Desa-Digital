import Users from "../models/UserModel.js";
import Biodata from "../models/BiodataModel.js";
import Program from "../models/ProgramModel.js";

export const getDashboardStats = async (req, res) => {
    try {

        const totalWarga = await Users.count({
            where: { role: 'user' }
        });

        const programAktif = await Program.count({
            where: { isOpen: true }
        });

        const totalPengajuan = await Biodata.count();
        
        const statusMenunggu = await Biodata.count({
            where: { status_pengajuan: 'Menunggu' }
        });

        const statusDisetujui = await Biodata.count({
            where: { status_pengajuan: 'Disetujui' }
        });

        const statusDitolak = await Biodata.count({
            where: { status_pengajuan: 'Ditolak' }
        });

        const perluSurvey = await Biodata.count({
            where: { 
                status_pengajuan: 'Menunggu',
                is_surveyed: false
            }
        });

        res.status(200).json({
            total_warga: totalWarga,
            program_aktif: programAktif,
            total_pengajuan: totalPengajuan,
            menunggu: statusMenunggu,
            disetujui: statusDisetujui,
            ditolak: statusDitolak,
            perlu_survey: perluSurvey
        });

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}