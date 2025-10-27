
import React, { useState, useCallback, useEffect } from 'react';
import { User, Student, Role } from './types';
import { INITIAL_STUDENTS, SUBJECTS, ADMIN_PASSWORD } from './constants';
import LoginComponent from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const savedData = localStorage.getItem('studentData');
      return savedData ? JSON.parse(savedData) : INITIAL_STUDENTS;
    } catch (error) {
      console.error("Failed to parse student data from localStorage", error);
      return INITIAL_STUDENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('studentData', JSON.stringify(students));
    } catch (error) {
      console.error("Failed to save student data to localStorage", error);
    }
  }, [students]);

  const handleLogin = useCallback((username: string, password: string): boolean => {
    const lowerCaseUsername = username.toLowerCase();
    
    // Check for admin login
    const subjectAdmin = SUBJECTS.find(s => s.toLowerCase() === lowerCaseUsername);
    if (subjectAdmin && password === ADMIN_PASSWORD) {
      setUser({ username: subjectAdmin, role: Role.ADMIN, subject: subjectAdmin });
      return true;
    }

    // Check for student login
    const studentLogin = students.find(s => s.name.toLowerCase() === lowerCaseUsername);
    if (studentLogin && password === studentLogin.nim) {
      setUser({ username: studentLogin.name, role: Role.STUDENT, studentId: studentLogin.id });
      return true;
    }

    return false;
  }, [students]);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 font-sans">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} studentData={students} setStudentData={setStudents} />
      ) : (
        <LoginComponent onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
