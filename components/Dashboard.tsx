
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { User, Student, Role, Scores, Attendance, Proactivity, Assignments, Exams } from '../types';
import { SUBJECTS } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';

// --- HELPER FUNCTIONS ---
const calculateAttendanceScore = (attendance: Attendance) => {
  return attendance.totalSessions > 0 ? (attendance.present / attendance.totalSessions) * 100 : 0;
};
const calculateProactivityScore = (proactivity: Proactivity) => {
  return (proactivity.initiative + proactivity.participation + proactivity.discipline) / 3;
};
const calculateAssignmentsScore = (assignments: Assignments) => {
  return (assignments.responsibility + assignments.teamwork) / 2;
};
const calculateExamsScore = (exams: Exams) => {
  return (exams.uts1 + exams.uas1 + exams.uts2 + exams.uas2) / 4;
};
const calculateFinalScore = (scores: Scores): number => {
    if (!scores) return 0;
    const attendance = calculateAttendanceScore(scores.attendance) * 0.1;
    const proactivity = calculateProactivityScore(scores.proactivity) * 0.2;
    const assignments = calculateAssignmentsScore(scores.assignments) * 0.3;
    const exams = calculateExamsScore(scores.exams) * 0.4;
    return parseFloat((attendance + proactivity + assignments + exams).toFixed(2));
};

// --- ICON COMPONENTS ---
const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>);
const EditIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);
const DashboardIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 21h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>);
const UserPlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>);
const TrashIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>);

// --- PROPS INTERFACE ---
interface DashboardProps {
  user: User;
  onLogout: () => void;
  studentData: Student[];
  setStudentData: React.Dispatch<React.SetStateAction<Student[]>>;
}

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, studentData, setStudentData }) => {
  const [activeView, setActiveView] = useState('dashboard');
  
  const initialStudentId = user.role === Role.STUDENT ? user.studentId! : studentData[0]?.id;
  const initialSubject = user.role === Role.ADMIN ? user.subject! : SUBJECTS[0];

  const [selectedStudentId, setSelectedStudentId] = useState<string>(initialStudentId);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);

  const selectedStudent = useMemo(() => studentData.find(s => s.id === selectedStudentId), [studentData, selectedStudentId]);
  
  useEffect(() => {
    if (user.role === Role.STUDENT && user.studentId) {
      setSelectedStudentId(user.studentId);
    }
  }, [user]);

  const rankingData = useMemo(() => {
    return studentData
      .map(student => ({
        ...student,
        finalScore: calculateFinalScore(student.scores[selectedSubject]),
      }))
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((student, index) => ({ ...student, rank: index + 1 }));
  }, [studentData, selectedSubject]);

  const studentRank = useMemo(() => {
      const rankInfo = rankingData.find(s => s.id === selectedStudentId);
      return rankInfo ? rankInfo.rank : null;
  }, [rankingData, selectedStudentId]);

  if (!selectedStudent) {
    return <div className="p-8 text-center text-xl">Memuat data murid...</div>;
  }
  
  const currentScores = selectedStudent.scores[selectedSubject];

  const proactivityChartData = [
    { subject: 'Inisiatif', A: calculateProactivityScore(currentScores.proactivity) > 0 ? currentScores.proactivity.initiative : 0, fullMark: 100 },
    { subject: 'Partisipasi', A: calculateProactivityScore(currentScores.proactivity) > 0 ? currentScores.proactivity.participation : 0, fullMark: 100 },
    { subject: 'Kedisiplinan', A: calculateProactivityScore(currentScores.proactivity) > 0 ? currentScores.proactivity.discipline : 0, fullMark: 100 },
  ];
  
  const attendanceChartData = [
    { 
      name: 'Kehadiran', 
      value: calculateAttendanceScore(currentScores.attendance),
      fill: '#8884d8'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">Dashboard Kelas VIIA</h1>
          <p className="text-navy-300">Selamat datang, {user.username}!</p>
        </div>
        <div className="flex items-center gap-4">
          {user.role === Role.ADMIN && (
            <div className="flex items-center bg-navy-900 rounded-lg p-1">
              <button onClick={() => setActiveView('dashboard')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-navy-300 hover:bg-navy-800'}`}><DashboardIcon/></button>
              <button onClick={() => setActiveView('input')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${activeView === 'input' ? 'bg-indigo-600 text-white' : 'text-navy-300 hover:bg-navy-800'}`}><EditIcon/></button>
            </div>
          )}
          <button onClick={onLogout} className="p-2 bg-navy-800 hover:bg-red-600/50 rounded-lg transition text-navy-300 hover:text-white"><LogoutIcon /></button>
        </div>
      </header>

      {activeView === 'dashboard' && (
        <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 xl:col-span-1 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-sky-300">Profil Murid</h2>
              {user.role === Role.ADMIN && (
                <div className="space-y-4 mb-4">
                  <div>
                      <label className="text-sm text-navy-300 block mb-1">Pilih Murid</label>
                      <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full p-2 bg-navy-800 border border-navy-700 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                          {studentData.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                  </div>
                  <div>
                      <label className="text-sm text-navy-300 block mb-1">Mata Pelajaran</label>
                      <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="w-full p-2 bg-navy-800 border border-navy-700 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                </div>
              )}
              <div className="text-center">
                <img src={selectedStudent.photoUrl} alt={selectedStudent.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-navy-700" />
                <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                <p className="text-navy-400">NIM: {selectedStudent.nim}</p>
                <div className="mt-4 flex justify-center gap-4">
                    <div className="p-4 bg-navy-900 rounded-lg">
                        <p className="text-3xl font-bold text-indigo-400">{calculateFinalScore(currentScores).toFixed(2)}</p>
                        <p className="text-sm text-navy-400">Nilai Akhir</p>
                    </div>
                    <div className="p-4 bg-navy-900 rounded-lg">
                        <p className="text-3xl font-bold text-sky-400">{studentRank || 'N/A'}</p>
                        <p className="text-sm text-navy-400">Peringkat</p>
                    </div>
                </div>
              </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold mb-2 text-sky-300">Nilai Kehadiran</h2>
                 <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <RadialBarChart innerRadius="70%" outerRadius="100%" data={attendanceChartData} startAngle={90} endAngle={-270}>
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey='value' angleAxisId={0} data={[{ value: 100 }]} fill="#1e293b" cornerRadius={10} />
                            <RadialBar dataKey="value" cornerRadius={10} />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-current text-white">
                                {`${Math.round(attendanceChartData[0].value)}%`}
                            </text>
                            <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Persentase"]} />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>
          
          {/* Center Column */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <Card>
                <h2 className="text-xl font-semibold mb-4 text-sky-300">Rapor Nilai Mata Pelajaran</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {SUBJECTS.map(subject => (
                        <div key={subject} className={`p-3 rounded-lg text-center ${subject === selectedSubject ? 'bg-indigo-600' : 'bg-navy-900'}`}>
                            <p className="text-xs font-medium truncate text-navy-300">{subject}</p>
                            <p className="text-2xl font-bold">{calculateFinalScore(selectedStudent.scores[subject]).toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card>
                 <h2 className="text-xl font-semibold mb-4 text-sky-300">Peringkat Kelas - {selectedSubject}</h2>
                 <div className="max-h-96 overflow-y-auto pr-2">
                     <table className="w-full text-left">
                         <thead>
                             <tr className="border-b border-navy-700">
                                 <th className="p-2">Peringkat</th>
                                 <th className="p-2">Nama</th>
                                 <th className="p-2">NIM</th>
                                 <th className="p-2 text-right">Nilai Akhir</th>
                             </tr>
                         </thead>
                         <tbody>
                             {rankingData.map(s => (
                                 <tr key={s.id} className={`border-b border-navy-800 ${s.id === selectedStudentId ? 'bg-navy-700/50' : ''}`}>
                                     <td className="p-2 font-bold text-indigo-400 text-lg">{s.rank}</td>
                                     <td className="p-2">{s.name}</td>
                                     <td className="p-2 text-navy-400">{s.nim}</td>
                                     <td className="p-2 text-right font-semibold">{s.finalScore.toFixed(2)}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </Card>
          </div>
          
          {/* Right Column */}
           <div className="lg:col-span-3 xl:col-span-1 space-y-6">
             <Card>
                <h2 className="text-xl font-semibold mb-2 text-sky-300">Analisis Proaktif</h2>
                 <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={proactivityChartData}>
                            <PolarGrid stroke="#475569" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8' }}/>
                            <Radar name={selectedStudent.name} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>
        </main>
      )}

      {activeView === 'input' && user.role === Role.ADMIN && (
        <AdminInputPanel 
          students={studentData} 
          setStudents={setStudentData} 
          adminSubject={user.subject!} 
        />
      )}
    </div>
  );
};

// --- CARD COMPONENT ---
const Card: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="bg-navy-900/70 backdrop-blur-sm border border-navy-800 rounded-xl p-4 sm:p-6 shadow-lg">
    {children}
  </div>
);

// --- ADMIN INPUT PANEL ---
type InputView = 'kehadiran' | 'proaktif' | 'tugas' | 'ujian';

const AdminInputPanel: React.FC<{
  students: Student[]; 
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>; 
  adminSubject: string;
}> = ({ students, setStudents, adminSubject }) => {
  const [activeTab, setActiveTab] = useState<InputView>('kehadiran');
  const [localStudents, setLocalStudents] = useState<Student[]>(JSON.parse(JSON.stringify(students)));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // FIX: Changed `category` type from `InputView` to `keyof Scores` to match the property names of the scores object.
  const handleInputChange = (studentId: string, field: string, value: any, category: keyof Scores) => {
    setLocalStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const newScores = { ...student.scores };
        if (!newScores[adminSubject]) {
             newScores[adminSubject] = {
                attendance: { present: 0, permission: 0, sick: 0, totalSessions: 20 },
                proactivity: { initiative: 0, participation: 0, discipline: 0 },
                assignments: { responsibility: 0, teamwork: 0 },
                exams: { uts1: 0, uas1: 0, uts2: 0, uas2: 0 },
            };
        }
        
        const scoreCategory = newScores[adminSubject][category];
        (scoreCategory as any)[field] = Number(value);
        return { ...student, scores: newScores };
      }
      return student;
    }));
  };

  const handleAddStudent = () => {
    const newName = prompt("Masukkan nama murid baru:");
    if (newName) {
        const newId = `murid-${Date.now()}`;
        const newNim = `2300${1000 + students.length + 1}`;
        const scores: { [subject: string]: Scores } = {};
        SUBJECTS.forEach(subject => {
            scores[subject] = {
                attendance: { present: 0, permission: 0, sick: 0, totalSessions: 20 },
                proactivity: { initiative: 75, participation: 75, discipline: 75 },
                assignments: { responsibility: 75, teamwork: 75 },
                exams: { uts1: 75, uas1: 75, uts2: 75, uas2: 75 },
            };
        });
        const newStudent: Student = {
            id: newId,
            nim: newNim,
            name: newName,
            photoUrl: `https://picsum.photos/seed/${newId}/200`,
            scores,
        };
        setLocalStudents(prev => [...prev, newStudent]);
        showToast(`Murid "${newName}" berhasil ditambahkan.`);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    const studentToDelete = localStudents.find(s => s.id === studentId);
    if(studentToDelete && window.confirm(`Apakah Anda yakin ingin menghapus murid "${studentToDelete.name}"?`)){
        setLocalStudents(prev => prev.filter(s => s.id !== studentId));
        showToast(`Murid "${studentToDelete.name}" berhasil dihapus.`);
    }
  };
  
  const handleSubmit = () => {
    setStudents(localStudents);
    localStorage.setItem('studentData', JSON.stringify(localStudents));
    showToast("Data berhasil di-submit dan disimpan!");
  };

  const handleRevisi = () => {
    try {
        const savedData = localStorage.getItem('studentData');
        if (savedData) {
            setLocalStudents(JSON.parse(savedData));
            showToast("Data berhasil ditarik untuk revisi.");
        } else {
            showToast("Tidak ada data tersimpan untuk direvisi.");
        }
    } catch(e) {
        showToast("Gagal memuat data revisi.");
    }
  };

  const renderTable = () => {
    const commonCols = (s: Student) => (
        <>
          <td className="p-2">{localStudents.indexOf(s) + 1}</td>
          <td className="p-2">{s.name}</td>
          <td className="p-2 text-navy-400">{s.nim}</td>
        </>
    );

    const inputClass = "w-16 bg-navy-800 text-center rounded p-1 focus:ring-1 focus:ring-indigo-500 outline-none";
    const scores = (student: Student) => student.scores[adminSubject] || {
      attendance: { present: 0, permission: 0, sick: 0, totalSessions: 20 },
      proactivity: { initiative: 0, participation: 0, discipline: 0 },
      assignments: { responsibility: 0, teamwork: 0 },
      exams: { uts1: 0, uas1: 0, uts2: 0, uas2: 0 },
    };

    switch(activeTab) {
      case 'kehadiran':
        return (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-navy-700">
                <th className="p-2">No</th><th className="p-2">Nama</th><th className="p-2">NIM</th>
                <th className="p-2">Hadir</th><th className="p-2">Izin</th><th className="p-2">Sakit</th>
                <th className="p-2">Total Masuk</th>
              </tr>
            </thead>
            <tbody>
              {localStudents.map(s => (
                <tr key={s.id} className="border-b border-navy-800">
                  {commonCols(s)}
                  <td><input type="number" value={scores(s).attendance.present} onChange={e => handleInputChange(s.id, 'present', e.target.value, 'attendance')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).attendance.permission} onChange={e => handleInputChange(s.id, 'permission', e.target.value, 'attendance')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).attendance.sick} onChange={e => handleInputChange(s.id, 'sick', e.target.value, 'attendance')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).attendance.totalSessions} onChange={e => handleInputChange(s.id, 'totalSessions', e.target.value, 'attendance')} className={inputClass} /></td>
                  <td className="p-2"><button onClick={() => handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-300"><TrashIcon/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
       case 'proaktif':
        return (
          <table className="w-full text-left">
            <thead><tr className="border-b border-navy-700"><th className="p-2">No</th><th className="p-2">Nama</th><th className="p-2">NIM</th><th className="p-2">Inisiatif</th><th className="p-2">Partisipasi</th><th className="p-2">Kedisiplinan</th></tr></thead>
            <tbody>
              {localStudents.map(s => (
                <tr key={s.id} className="border-b border-navy-800">
                  {commonCols(s)}
                  <td><input type="number" value={scores(s).proactivity.initiative} onChange={e => handleInputChange(s.id, 'initiative', e.target.value, 'proactivity')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).proactivity.participation} onChange={e => handleInputChange(s.id, 'participation', e.target.value, 'proactivity')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).proactivity.discipline} onChange={e => handleInputChange(s.id, 'discipline', e.target.value, 'proactivity')} className={inputClass} /></td>
                  <td className="p-2"><button onClick={() => handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-300"><TrashIcon/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'tugas':
        return (
          <table className="w-full text-left">
            <thead><tr className="border-b border-navy-700"><th className="p-2">No</th><th className="p-2">Nama</th><th className="p-2">NIM</th><th className="p-2">Tanggung Jawab</th><th className="p-2">Kerjasama Tim</th></tr></thead>
            <tbody>
              {localStudents.map(s => (
                <tr key={s.id} className="border-b border-navy-800">
                  {commonCols(s)}
                  <td><input type="number" value={scores(s).assignments.responsibility} onChange={e => handleInputChange(s.id, 'responsibility', e.target.value, 'assignments')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).assignments.teamwork} onChange={e => handleInputChange(s.id, 'teamwork', e.target.value, 'assignments')} className={inputClass} /></td>
                  <td className="p-2"><button onClick={() => handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-300"><TrashIcon/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'ujian':
        return (
          <table className="w-full text-left">
            <thead><tr className="border-b border-navy-700"><th className="p-2">No</th><th className="p-2">Nama</th><th className="p-2">NIM</th><th className="p-2">UTS 1</th><th className="p-2">UAS 1</th><th className="p-2">UTS 2</th><th className="p-2">UAS 2</th></tr></thead>
            <tbody>
              {localStudents.map(s => (
                <tr key={s.id} className="border-b border-navy-800">
                  {commonCols(s)}
                  <td><input type="number" value={scores(s).exams.uts1} onChange={e => handleInputChange(s.id, 'uts1', e.target.value, 'exams')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).exams.uas1} onChange={e => handleInputChange(s.id, 'uas1', e.target.value, 'exams')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).exams.uts2} onChange={e => handleInputChange(s.id, 'uts2', e.target.value, 'exams')} className={inputClass} /></td>
                  <td><input type="number" value={scores(s).exams.uas2} onChange={e => handleInputChange(s.id, 'uas2', e.target.value, 'exams')} className={inputClass} /></td>
                  <td className="p-2"><button onClick={() => handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-300"><TrashIcon/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };
  
  const tabs: {id: InputView, label: string}[] = [
      {id: 'kehadiran', label: 'Nilai Kehadiran'},
      {id: 'proaktif', label: 'Nilai Proaktif'},
      {id: 'tugas', label: 'Nilai Tugas'},
      {id: 'ujian', label: 'Nilai Ujian'},
  ];

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-sky-300">Input Data Murid: {adminSubject}</h2>
        <div className="flex gap-2">
            <button onClick={handleAddStudent} className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-2"><UserPlusIcon/> Tambah Murid</button>
        </div>
      </div>
      <div className="flex border-b border-navy-700 mb-4">
        {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 -mb-px border-b-2 text-sm font-medium transition ${activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-navy-400 hover:text-white'}`}>
                {tab.label}
            </button>
        ))}
      </div>
      <div className="max-h-[60vh] overflow-auto">
        {renderTable()}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button onClick={handleRevisi} className="px-6 py-2 font-semibold rounded-lg bg-navy-700 hover:bg-navy-600 transition">Revisi Data</button>
        <button onClick={handleSubmit} className="px-6 py-2 font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition">Submit</button>
      </div>
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
          {toastMessage}
        </div>
      )}
    </Card>
  );
};

export default Dashboard;
