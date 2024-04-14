import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);
  
    return (
        <View style={styles.faqItem}>
            <TouchableOpacity
            style={styles.questionContainer}
            onPress={() => setIsOpen(!isOpen)}
            >
            <Text style={styles.questionText}>{question}</Text>
            </TouchableOpacity>
            {isOpen && <Text style={styles.answerText}>{answer}</Text>}
        </View>
    );
};

const faqData = [
    {
		question: 'What information do you collect about me?',
		answer: 'We collect information that you provide to us directly, such as your name, email address, and phone number, as well as information about your usage of our services through tracking technologies like cookies.'
	},
	{
		question: 'How is my information used?',
		answer: 'Your information is used to provide and improve our services, to communicate with you, to personalize your experience, and to comply with legal obligations.'
	},
	{
		question: 'Do you share my information with third parties?',
		answer: 'We only share your information with third parties when necessary for the provision of services, with your consent, or as required by law. We ensure all third parties adhere to strict data protection standards.'
	},
	{
		question: 'How do you protect my information?',
		answer: 'We implement a variety of security measures to maintain the safety of your personal information, including encryption, firewalls, and secure server hosting.'
	},
	{
		question: 'Can I access or delete my information?',
		answer: 'Yes, you have the right to access, correct, or delete your personal information at any time. Please contact our support team to make such requests.'
	},
	{
		question: 'What are cookies, and how do you use them?',
		answer: 'Cookies are small data files stored on your device. We use cookies to improve your experience, analyze site traffic, and serve targeted advertisements. You can control the use of cookies at the individual browser level.'
	},
	
	// Add more privacy-related FAQ items as needed 
];

const FAQPage = () => {
    return (
        <View style={styles.container}>
        <View style={styles.headerBar}>
            <Text style={styles.headerText}>Spying on you...?</Text>
        </View>
        <ScrollView style={styles.scrollView}>
            <View style={styles.introduction}>
            <Text style={styles.introText}>
                Your information is safe with us!
            </Text>
            </View>
            {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBar: {
        backgroundColor: '#48c289',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        padding: 20,
    },
    introduction: {
        marginBottom: 20,
    },
    introText: {
        fontSize: 18,
        color: '#666',
        lineHeight: 24,
    },
    faqItem: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
    },
    questionContainer: {
        padding: 15,
        backgroundColor: '#48c289',
        borderRadius: 5,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    answerText: {
        fontSize: 14,
        color: '#666',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 20,
        lineHeight: 22,
        backgroundColor: '#f9f9f9',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
});

export default FAQPage;
