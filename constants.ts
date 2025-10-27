
import { Student, Scores } from './types';

export const SUBJECTS = [
  "Pendidikan Agama dan Budi Pekerti",
  "Pendidikan Kewarganegaraan",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Matematika",
  "Ilmu Pengetahuan Alam",
  "Ilmu Pengetahuan Sosial",
  "Seni Budaya",
  "Pendidikan Jasmani, Olahraga, dan Kesehatan",
  "Informatika"
];

export const ADMIN_PASSWORD = "12345678910";

const studentNames = [
    "Ahmad Budi", "Citra Dewi", "Eko Prasetyo", "Fitriani Sari", "Galih Wijaya",
    "Hana Lestari", "Indra Kusuma", "Joko Susilo", "Kartika Putri", "Lia Anggraini",
    "Muhammad Rizki", "Nurul Hidayah", "Putra Pratama", "Rina Amelia", "Siti Nurhaliza",
    "Tono Santoso", "Wahyu Nugroho", "Yulia Puspita", "Zainal Abidin", "Agus Setiawan",
    "Bella Permata", "Dian Saputra", "Farah Adiba", "Gita Gutawa", "Heru Wibowo",
    "Ika Safitri", "Kevin Sanjaya", "Lina Marlina", "Nanda Pratama", "Olivia Jensen",
    "Rendy Pandugo", "Sari aulia", "Tegar Septian", "Vino Bastian", "Wulan Guritno"
];

const getRandomScore = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateStudentScores = (): Scores => ({
  attendance: {
    present: getRandomScore(15, 20),
    permission: getRandomScore(0, 2),
    sick: getRandomScore(0, 3),
    totalSessions: 20,
  },
  proactivity: {
    initiative: getRandomScore(70, 100),
    participation: getRandomScore(65, 100),
    discipline: getRandomScore(75, 100),
  },
  assignments: {
    responsibility: getRandomScore(70, 100),
    teamwork: getRandomScore(68, 100),
  },
  exams: {
    uts1: getRandomScore(60, 100),
    uas1: getRandomScore(55, 100),
    uts2: getRandomScore(62, 100),
    uas2: getRandomScore(60, 100),
  },
});

export const generateInitialData = (): Student[] => {
  return studentNames.map((name, index) => {
    const studentId = `murid-${index + 1}`;
    const scores: { [subject: string]: Scores } = {};
    SUBJECTS.forEach(subject => {
      scores[subject] = generateStudentScores();
    });

    return {
      id: studentId,
      nim: `2300${1001 + index}`,
      name: name,
      photoUrl: `https://picsum.photos/seed/${studentId}/200`,
      scores: scores,
    };
  });
};

export const INITIAL_STUDENTS = generateInitialData();
