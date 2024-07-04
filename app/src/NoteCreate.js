import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NoteCreate = ({ onSubmit, navigation }) => {
  const [notename, setNotename] = useState('');
  const [notetext, setNotetext] = useState('');

  const handleSubmit = () => {
    const newNote = {
      notename,
      notetext,
    };
    onSubmit(newNote);
    navigation.goBack(); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <View style={styles.content}> 
        <Text style={styles.title}>Criar Nova Nota</Text>
        <TextInput
          style={styles.input}
          placeholder="Título da Nota"
          value={notename}
          onChangeText={setNotename}
        />
        <TextInput
          style={styles.input}
          placeholder="Conteúdo da Nota"
          value={notetext}
          onChangeText={setNotetext}
          multiline
        />
        <Button title="Salvar" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, 
    backgroundColor: '#F0F0F0',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    backgroundColor: '#f0f0f0', 
    borderRadius: 4,
    elevation: 2, 
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingTop: 60,
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

export default NoteCreate;