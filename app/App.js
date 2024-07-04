import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NoteCreate from './src/NoteCreate';
import NoteEdit from './src/NoteEdit';

const Stack = createNativeStackNavigator();

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('https://kze-app.vercel.app/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    }
  };

  const handleNoteCreate = async (newNote) => {
    try {
      const response = await fetch('https://kze-app.vercel.app/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Erro ao criar nota:', response.status);
      }
    } catch (error) {
      console.error('Erro ao criar nota:', error);
    }
  };

  const handleNoteDelete = async (id) => {
    Alert.alert(
      'Excluir Nota',
      'Tem certeza que deseja excluir esta nota?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`https://kze-app.vercel.app/notes/${id}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                fetchNotes();
              } else {
                console.error('Erro ao remover nota:', response.status);
              }
            } catch (error) {
              console.error('Erro ao remover nota:', error);
            }
          },
        },
      ]
    );
  };

  const handleNoteEdit = async (id, updatedNote) => {
    try {
      const response = await fetch(`https://kze-app.vercel.app/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });

      if (response.ok) {
        fetchNotes();
      } else {
        console.error('Erro ao atualizar nota:', response.status);
      }
    } catch (error) {
      console.error('Erro ao atualizar nota:', error);
    }
  };

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Stack.Navigator>
          <Stack.Screen
            name="NoteList"
            options={{ headerShown: false }}
          >
            {({ navigation }) => (
              <View style={styles.innerContainer}>
                <FlatList
                  data={notes}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.noteItem}
                      onPress={() => navigation.navigate('NoteEdit', { note: item })}
                      onLongPress={() => handleNoteDelete(item.id)}
                    >
                      <Text style={styles.noteTitle}>{item.notename}</Text>
                      <Text style={styles.noteText}>{item.notetext}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('NoteCreate')}>
                  <Text style={styles.buttonText}>Criar Nota</Text>
                </TouchableOpacity>
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen
            name="NoteCreate"
            options={{ headerShown: false }}
          >
            {({ navigation }) => (
              <NoteCreate onSubmit={handleNoteCreate} navigation={navigation} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="NoteEdit"
            options={{ headerShown: false }}
          >
            {({ route, navigation }) => (
              <NoteEdit note={route.params.note} onSubmit={handleNoteEdit} navigation={navigation} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight,
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  noteText: {
    fontSize: 16,
    color: '#555555',
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
});

export default App;