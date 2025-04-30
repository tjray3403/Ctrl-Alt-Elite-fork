import { View, Text, StyleSheet } from 'react-native';

<<<<<<<< HEAD:app/search/[query].jsx
const Search = () => {
  return (
    <View>
      <Text>Search</Text>
    </View>
  )
}

export default Search
========
export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Recs</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
>>>>>>>> trinity:app/(tabs)/Recommendations.tsx
