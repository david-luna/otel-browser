import React, {useEffect, useState} from 'react';
import {ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import {
  Todo,
  fetchTodos,
  // addTodo,
  // updateTodo,
  // deleteTodo,
} from './todo-service';
import Task from '../TodoItem/todo-item';

const TodoList = () => {
  const [isLoading, setLoading] = useState(true);
  const [todoTitle, setTodoTitle] = useState<string>();
  const [todoItems, setTodoItems] = useState<Todo[]>([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    if (todoTitle) {
      const todo: Todo = {
        id: '',
        title: todoTitle,
        completed: false,
      };
      // TODO: use service
      setTodoItems([...todoItems, todo])
      setTodoTitle(undefined);
    }
  }

  const completeTask = (index: number) => {
    let itemsCopy = [...todoItems];
    itemsCopy.splice(index, 1);
    setTodoItems(itemsCopy)
  }

  const getTodos = async () => {
    try {
      fetchTodos().then((todos) => setTodoItems([...todos]));
    } catch (e) {
      console.log('error', e)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getTodos() }, []);

  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      {
        isLoading ? (<ActivityIndicator/>) : (
          <View style={styles.tasksWrapper}>
            <Text style={styles.sectionTitle}>Today&apos;s tasks</Text>
            <View style={styles.items}>
              {/* This is where the tasks will go! */}
              {
                todoItems.map((item, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                      <Task text={item.title} /> 
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>
        )
      }
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={todoTitle} onChangeText={text => setTodoTitle(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});

export default TodoList;
