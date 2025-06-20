// screens/EducationScreen/PaymentScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EducationStackParamList } from '../../../navigation/EducationNav'; // adjust path
import { useEducation } from '../../../context/EducationProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Define Course & Lesson interfaces (or import from shared types)
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text';
  contentUri?: string;
  contentText?: string;
  duration?: number;
}
interface Course {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  category: string;
  lessons: Lesson[];
  price: number;
}

// Demo data: ensure this matches your CourseList data
const demoCourses: Course[] = [
  {
    id: 'c4',
    title: 'Introduction to Sustainable Farming',
    description:
      'Learn principles of sustainable agriculture to improve yield and protect environment.',
    imageUri:
      'https://via.placeholder.com/600x400.png?text=Sustainable+Farming',
    category: 'Sustainability',
    lessons: [
      {
        id: 'l1',
        title: 'What is Sustainable Farming?',
        type: 'text',
        contentText: 'Sustainable farming is ...',
      },
      {
        id: 'l2',
        title: 'Soil Health',
        type: 'video',
        contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
    price: 49.99,
  },
  // ... other courses, ensure IDs match CourseList
];

type PaymentRouteProp = RouteProp<EducationStackParamList, 'Payment'>;
type PaymentNavigationProp = StackNavigationProp<EducationStackParamList, 'Payment'>;

const PaymentScreen: React.FC = () => {
  const route = useRoute<PaymentRouteProp>();
  const navigation = useNavigation<PaymentNavigationProp>();
  const { courseId } = route.params || {};
  const { enrollCourse } = useEducation();

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);

  // Payment steps: 1=Review, 2=Payment details, 3=Processing, 4=Success
  const [step, setStep] = useState<number>(1);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'cash'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCVC, setCardCVC] = useState<string>('');
  const [cashConfirm, setCashConfirm] = useState<boolean>(false);

  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    console.log('PaymentScreen mounted, params:', route.params);
    if (!courseId) {
      Alert.alert('Error', 'No course ID provided.');
      setLoadingCourse(false);
      return;
    }
    // Simulate fetch of course details
    const found = demoCourses.find(c => c.id === courseId) || null;
    if (!found) {
      console.warn(`Course with id=${courseId} not found in demoCourses`);
    }
    setCourse(found);
    setLoadingCourse(false);
  }, [courseId]);

  if (loadingCourse) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Course not found.</Text>
      </View>
    );
  }

  const handleProceedToPaymentDetails = () => {
    setStep(2);
  };

  const handlePaymentSubmit = async () => {
    // Validate inputs
    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone.trim()) {
        Alert.alert('Validation', 'Please enter your Mpesa phone number.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
        Alert.alert('Validation', 'Please fill all card details.');
        return;
      }
    } else if (paymentMethod === 'cash') {
      if (!cashConfirm) {
        Alert.alert('Confirm', 'Tap again to confirm Cash payment.');
        setCashConfirm(true);
        return;
      }
    }

    setStep(3);
    setProcessing(true);

    // Simulate processing delay
    setTimeout(async () => {
      setProcessing(false);
      try {
        await enrollCourse(courseId);
        setStep(4);
      } catch (err) {
        console.error('Enroll after payment failed', err);
        Alert.alert('Error', 'Enrollment failed after payment.');
        setStep(1);
      }
    }, 2000);
  };

  const handleFinish = () => {
    // After successful payment + enrollment, navigate back to CourseDetail
    navigation.replace('CourseDetail', { courseId });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: course.imageUri }} style={styles.banner} />

<View style={styles.content}>
  <Text style={styles.title}>{course.title}</Text>
  <Text style={styles.category}>
    <MaterialCommunityIcons name="book-open-page-variant" size={16} />{" "}
    {course.category}
  </Text>
  <Text style={styles.description}>{course.description}</Text>

  <View style={styles.detailsRow}>
    <View style={styles.detailBox}>
      <Ionicons name="layers-outline" size={20} color="#4CAF50" />
      <Text style={styles.detailText}>{course.lessons.length} Lessons</Text>
    </View>
    <View style={styles.detailBox}>
      <Ionicons name="time-outline" size={20} color="#4CAF50" />
      <Text style={styles.detailText}>~{course.lessons.length * 10} mins</Text>
    </View>
    <View style={styles.detailBox}>
      <Ionicons name="document-text-outline" size={20} color="#4CAF50" />
      <Text style={styles.detailText}>Certificate</Text>
    </View>
  </View>
  
  </View>

      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>Step 1: Review & Confirm</Text>
          <Text style={styles.reviewText}>
            You are about to purchase <Text style={{ fontWeight: '600' }}>{course.title}</Text> for{' '}
            <Text style={{ fontWeight: '600' }}>KES {course.price.toFixed(2)}</Text>.
          </Text>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleProceedToPaymentDetails}
          >
            <Text style={styles.nextButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>Step 2: Payment Method</Text>

          {/* Payment method buttons */}
          <View style={styles.paymentMethodsRow}>
            {(['mpesa', 'card', 'cash'] as const).map(method => {
              const label =
                method === 'mpesa'
                  ? 'Mpesa'
                  : method === 'card'
                  ? 'Credit/Debit Card'
                  : 'Cash';
              const selected = paymentMethod === method;
              return (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.methodButton,
                    selected && styles.methodButtonSelected,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.methodButtonText,
                      selected && styles.methodButtonTextSelected,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Payment details form */}
          {paymentMethod === 'mpesa' && (
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Mpesa Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 07XXXXXXXX"
                keyboardType="phone-pad"
                value={mpesaPhone}
                onChangeText={setMpesaPhone}
              />
            </View>
          )}
          {paymentMethod === 'card' && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChangeText={setCardExpiry}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVC</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CVC"
                    keyboardType="number-pad"
                    value={cardCVC}
                    onChangeText={setCardCVC}
                  />
                </View>
              </View>
            </>
          )}
          {paymentMethod === 'cash' && (
            <View style={styles.formGroup}>
              <Text style={styles.cashText}>
                You will pay in cash upon first lesson or at specified pickup.
              </Text>
              <TouchableOpacity
                style={[
                  styles.confirmCashButton,
                  cashConfirm && styles.confirmCashButtonSelected,
                ]}
                onPress={() => setCashConfirm(prev => !prev)}
              >
                <Ionicons
                  name={cashConfirm ? 'checkbox' : 'square-outline'}
                  size={20}
                  color="#333"
                />
                <Text style={styles.confirmCashText}>Confirm Cash Payment</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePaymentSubmit}
          >
            <Text style={styles.payButtonText}>Pay KES {course.price.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.stepLabel}>Processing Payment...</Text>
          {processing ? (
            <ActivityIndicator size="large" />
          ) : (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setStep(4)}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === 4 && (
        <View style={styles.stepContainer}>
          <Ionicons name="checkmark-circle" size={64} color="#2e7d32" />
          <Text style={styles.successText}>Payment Successful!</Text>
          <Text style={styles.reviewText}>
            You are now enrolled in <Text style={{ fontWeight: '600' }}>{course.title}</Text>.
          </Text>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
          >
            <Text style={styles.finishButtonText}>Go to Course</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7FBF1',
    paddingBottom: 40,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 16, color: '#444' },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 16,
  },
  stepContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  nextButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  methodButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  methodButtonSelected: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#333',
  },
  methodButtonTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cashText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  confirmCashButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmCashButtonSelected: {},
  confirmCashText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  payButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
    marginTop: 12,
    marginBottom: 8,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  banner: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  detailBox: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 13,
    marginTop: 4,
    color: "#333",
  },
  priceCard: {
    backgroundColor: "#f1f8e9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  priceNote: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
});
