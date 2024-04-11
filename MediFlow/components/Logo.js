import React from 'react'
import { StyleSheet } from 'react-native'
import { theme } from '../core/theme'
import { Text } from 'react-native'

export default function Logo() {
  return <Text style={styles.mediflow}>MediFlow 🏥</Text>
}

const styles = StyleSheet.create({
  mediflow: {
    fontSize: 36,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
})