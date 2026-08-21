import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { ExternalLink, Shirt, RefreshCw } from 'lucide-react-native';
import { db, auth } from '../config/firebase';
import { COLORS } from '../constants/theme';

export default function WardrobeScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWardrobeItems = async () => {
    setRefreshing(true);
    try {
      const userId = auth.currentUser ? auth.currentUser.uid : 'guest-user-123';
      const colRef = collection(db, 'users', userId, 'wardrobe');
      const snapshot = await getDocs(colRef);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetched.length > 0) {
        setItems(fetched);
      } else if (global.wardrobeItems && global.wardrobeItems.length > 0) {
        setItems(global.wardrobeItems);
      } else {
        setItems([
          { id: '1', url: 'https://store.example.com/items/sage-oversized-blazer', createdAt: '10:30 AM' },
          { id: '2', url: 'https://store.example.com/items/cotton-linen-trousers', createdAt: 'Yesterday' },
          { id: '3', url: 'https://store.example.com/items/silk-minimalist-shirt', createdAt: '2 days ago' }
        ]);
      }
    } catch (e) {
      console.warn("Wardrobe load fallback:", e);
      setItems(global.wardrobeItems || [
        { id: '1', url: 'https://store.example.com/items/sage-oversized-blazer', createdAt: '10:30 AM' },
        { id: '2', url: 'https://store.example.com/items/cotton-linen-trousers', createdAt: 'Yesterday' }
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWardrobeItems();
  }, []);

  const openLink = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Link Scanned", url);
      }
    });
  };

  const renderGarmentCard = ({ item }) => (
    <View style={styles.gridCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconBox}>
          <Shirt color={COLORS.primary} size={20} />
        </View>
        <TouchableOpacity style={styles.openIconBtn} onPress={() => openLink(item.url)}>
          <ExternalLink color={COLORS.textLight} size={16} />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardUrl} numberOfLines={2}>{item.url}</Text>
      <Text style={styles.cardTime}>Added: {item.createdAt || 'Recent'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>My Wardrobe</Text>
          <Text style={styles.subtitle}>Saved clothing links & scanned items</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={fetchWardrobeItems}>
          <RefreshCw color={COLORS.primary} size={18} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderGarmentCard}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContainer}
        onRefresh={fetchWardrobeItems}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Shirt color={COLORS.textMuted} size={48} />
            <Text style={styles.emptyText}>No clothing items saved yet.</Text>
            <Text style={styles.emptySub}>Scan a barcode in the QR Scanner tab to populate your wardrobe.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.cardDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderDark,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  listContainer: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.cardDark,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderDark,
  },
  openIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardUrl: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
