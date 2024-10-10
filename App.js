import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedNotes, setCompletedNotes] = useState([]); 
  const [editTaskId, setEditTaskId] = useState(null);
  const [editNoteId, setEditNoteId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('Tasks');
  const [viewCompleted, setViewCompleted] = useState(false); 
  const [viewDeleted, setViewDeleted] = useState(false);

  const addItem = () => {
    if (!task.trim()) return;

    if (activeTab === 'Tasks') {
      if (editTaskId !== null) {
        const updatedTasks = tasks.map((t) =>
          t.id === editTaskId ? { id: t.id, name: task } : t
        );
        setTasks(updatedTasks);
        setEditTaskId(null);
      } else {
        setTasks([...tasks, { id: Date.now(), name: task }]);
      }
    } else {
      if (editNoteId !== null) {
        const updatedNotes = notes.map((n) =>
          n.id === editNoteId ? { id: n.id, name: task } : n
        );
        setNotes(updatedNotes);
        setEditNoteId(null);
      } else {
        setNotes([...notes, { id: Date.now(), name: task }]);
      }
    }

    setTask('');
  };

  const editItem = (itemId) => {
    if (activeTab === 'Tasks') {
      const taskToEdit = tasks.find((t) => t.id === itemId);
      if (taskToEdit) {
        setTask(taskToEdit.name);
        setEditTaskId(itemId);
      }
    } else {
      const noteToEdit = notes.find((n) => n.id === itemId);
      if (noteToEdit) {
        setTask(noteToEdit.name);
        setEditNoteId(itemId);
      }
    }
  };

  const deleteItem = (itemId, fromCompleted = false) => {
    if (activeTab === 'Tasks') {
      if (fromCompleted) {
        const taskToDelete = completedTasks.find((t) => t.id === itemId);
        if (taskToDelete) {
          setCompletedTasks(completedTasks.filter((t) => t.id !== itemId));
        }
      } else {
        const taskToDelete = tasks.find((t) => t.id === itemId);
        if (taskToDelete) {
          setDeletedTasks([...deletedTasks, taskToDelete]);
          setTasks(tasks.filter((t) => t.id !== itemId));
        }
      }
    } else {
      if (fromCompleted) {
        const noteToDelete = completedNotes.find((n) => n.id === itemId);
        if (noteToDelete) {
          setCompletedNotes(completedNotes.filter((n) => n.id !== itemId));
        }
      } else {
        const noteToDelete = notes.find((n) => n.id === itemId);
        if (noteToDelete) {
          setDeletedNotes([...deletedNotes, noteToDelete]);
          setNotes(notes.filter((n) => n.id !== itemId));
        }
      }
    }
  };

  const markAsCompleted = (itemId) => {
    if (activeTab === 'Tasks') {
      const taskToComplete = tasks.find((t) => t.id === itemId);
      if (taskToComplete) {
        setCompletedTasks([...completedTasks, taskToComplete]);
        setTasks(tasks.filter((t) => t.id !== itemId));
      }
    } else {
      const noteToComplete = notes.find((n) => n.id === itemId);
      if (noteToComplete) {
        setCompletedNotes([...completedNotes, noteToComplete]);
        setNotes(notes.filter((n) => n.id !== itemId));
      }
    }
  };

  const clearDeletedHistory = () => {
    setDeletedTasks([]);
    setDeletedNotes([]);
  };

  const toggleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const deleteSelectedItems = () => {
    const newCompletedTasks = completedTasks.filter((t) => !selectedItems.includes(t.id));
    setCompletedTasks(newCompletedTasks);
    setSelectedItems([]);
  };

  const filteredItems = (activeTab === 'Tasks' ? tasks : notes).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isStarted) {
    return (
      <View style={styles.startScreen}>
        <Text style={styles.title}>DoYourTask</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => setIsStarted(true)}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>powered by Nathalie Juagpao & Dessalyn Cabiladas</Text>
      </View>
    );    
  }

  const currentViewItems = viewDeleted
    ? activeTab === 'Tasks'
      ? deletedTasks
      : deletedNotes
    : viewCompleted
    ? activeTab === 'Tasks'
      ? completedTasks
      : completedNotes 
    : filteredItems;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setIsStarted(false)}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'Tasks' && styles.activeTab]}
          onPress={() => {
            setActiveTab('Tasks');
            setViewCompleted(false);
            setViewDeleted(false);
            setSelectedItems([]);
            setSearchQuery('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'Tasks' && styles.activeTabText]}>Tasks</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'Notes' && styles.activeTab]}
          onPress={() => {
            setActiveTab('Notes');
            setViewCompleted(false);
            setViewDeleted(false);
            setSelectedItems([]);
            setSearchQuery('');
          }}
        >
          <Text style={[styles.tabText, activeTab === 'Notes' && styles.activeTabText]}>Notes</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${activeTab.slice(0, -1)}`} 
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      <View style={styles.viewButtons}>
        <TouchableOpacity onPress={() => setViewCompleted(!viewCompleted)}>
          <Text style={styles.viewButton}>{viewCompleted ? 'Back to Active' : 'View Completed'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setViewDeleted(!viewDeleted)}>
          <Text style={styles.viewButton}>{viewDeleted ? 'Back to Active' : 'View Deleted'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentViewItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (viewCompleted) {
                toggleSelectItem(item.id);
              }
            }}
          >
            <View style={[styles.taskItem, selectedItems.includes(item.id) && styles.selectedTask]}>
              <Text>{item.name}</Text>
              <View style={styles.taskActions}>
                {viewCompleted ? (
                  <TouchableOpacity onPress={() => deleteItem(item.id, true)}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                ) : (
                  !viewDeleted && (
                    <>
                      <TouchableOpacity onPress={() => editItem(item.id)}>
                        <Text style={styles.editButton}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteItem(item.id)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => markAsCompleted(item.id)}>
                        <Text style={styles.completeButton}>Complete</Text>
                      </TouchableOpacity>
                    </>
                  )
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={activeTab === 'Tasks' ? 'Enter task...' : 'Enter note...'}
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {viewDeleted && (
        <TouchableOpacity onPress={clearDeletedHistory} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Deleted History</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'lightgrey',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  activeTab: {
    borderBottomColor: 'purple',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  searchInput: {
    marginBottom: 15, 
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  viewButton: {
    fontSize: 16,
    color: 'purple',
  },
  taskItem: {
    padding: 10,
    backgroundColor: 'whiteSmoke',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedTask: {
    backgroundColor: '#e0f7fa',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    color: 'red',
  },
  editButton: {
    color: 'darkviolet',
  },
  completeButton: {
    color: 'green',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
    padding: 10,
  },
  addButtonText: {
    color: '#fff',
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  startButton: {
    padding: 15,
    backgroundColor: 'purple',
    borderRadius: 18,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#aaa',
  },
  footer: {
    position: 'absolute',   
    bottom: 20,             
    fontSize: 12,
    color: '#aaa',
  },  
});
