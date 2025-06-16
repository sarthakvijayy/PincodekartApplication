import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useMutation } from '@apollo/client';
import { EDIT_PROFILE } from '../../graphql/mutations';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [gender, setGender] = useState('');
  const [mobileNumber, setMobileNumber] = useState();
  const [email] = useState(); // Replace with real user data

  const [updateUserProfile, { loading }] = useMutation(EDIT_PROFILE, {
    onCompleted: () => {
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleSave = () => {
    if (!firstName || !lastName || !mobileNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    updateUserProfile({
      variables: {
        firstName,
        lastName,
        mobileNo: mobileNumber,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
 colors={['#184977', '#459BEC', '#73BBFF', '#DFF0FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
  style={styles.header}
>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
    <Ionicons name="arrow-back" size={26} color="#fff" />
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Edit Profile</Text>
</LinearGradient>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter Your First Name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter Your Last Name"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        {/* Mobile Number */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              editable={true}
              onChangeText={setMobileNumber}
              placeholder="Enter Your Mobile No."
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Email (non-editable) */}
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
              placeholder="Enter Your E-mail"
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.updateText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <TouchableOpacity style={styles.optionBtn}>
          <Text style={styles.optionText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveBtnContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FC',
  },
  header: {
  width: '100%',
  height: 100,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  paddingHorizontal: 16,
  paddingBottom: 14,
  paddingTop: 40,
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},
backIcon: {
  marginRight: 12,
},
headerTitle: {
  fontSize: 20,
  color: '#fff',
  fontFamily: 'Poppins-SemiBold',
},

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontFamily: 'Poppins-Medium',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  updateText: {
    color: '#2A55E5',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    paddingHorizontal: 10,
    marginBottom: 28,
  },
  optionBtn: {
    paddingVertical: 16,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: 'red',
    fontFamily: 'Poppins-Medium',
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 16,
  },
  saveBtn: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    borderColor: '#2A55E5',
    borderWidth: 2,
  },
  saveBtnText: {
    color: '#2A55E5',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});
