import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Family {
  id: string;
  name: string;
  parent: {
    name: string;
    role: string;
  };
  teen: {
    name: string;
    role: string;
  };
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  familyId: string;
  author: string;
  content: string;
  mood: string;
  entryType: 'parent' | 'teen';
  timestamp: string;
  aiInsight: string | null;
}

interface FamilyContextType {
  currentFamily: Family | null;
  journalEntries: JournalEntry[];
  setCurrentFamily: (family: Family | null) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  setJournalEntries: (entries: JournalEntry[]) => void;
  clearFamilyData: () => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const addJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => [entry, ...prev]);
  };

  const clearFamilyData = () => {
    setCurrentFamily(null);
    setJournalEntries([]);
  };

  const value: FamilyContextType = {
    currentFamily,
    journalEntries,
    setCurrentFamily,
    addJournalEntry,
    setJournalEntries,
    clearFamilyData,
  };

  return (
    <FamilyContext.Provider value={value}>
      {children}
    </FamilyContext.Provider>
  );
};