import { View } from "react-native";
import TodoList from '@/components/TodoList';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <TodoList></TodoList>
    </View>
  );
}
