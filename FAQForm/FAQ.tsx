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
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the settings page, go to the "login" page and select "Forget Password".',
    },
    {
        question: 'How can I contact customer support?',
        answer: 'Customer support can be reached via email at support@CycleSaavy.com or by phone at 9060 8359.',
    },
    {
        question: 'How do I report a problem or bug?',
        answer: 'If you encounter a problem or bug, please report it via our support email at bugs@CycleSaavy.com. Include as much details as possible to help us resolve the issue quickly.',
    },
    {
        question: 'How does CycleSaavy keep the parking lots updated?',
        answer: "We respond promptly to users' feedback, ensuring that there are sufficient parking lots for users to park at.",
    },
    {
        question: 'How can I share my ride details to someone else?',
        answer: "We understand the need for security and as such, we have provided a feature for a real-time update on your location and your destination to another user via an URL.",
    },
    {
        question: "How do I provide a different starting location?",
        answer: "Searching in preparation for your next trip? Fret not, CycleSaavy allows you to provide a different starting point when you provide the postal code.",
    }
    // Add more FAQ items here
];

const FAQPage = () => {
    return (
        <View style={styles.container}>
        <StatusBar backgroundColor="#48c289" barStyle="light-content" />
        <View style={styles.headerBar}>
            <Text style={styles.headerText}>How can we help you?</Text>
        </View>
        <ScrollView style={styles.scrollView}>
            <View style={styles.introduction}>
            <Text style={styles.introTitle}>Frequently Asked Questions</Text>
            <Text style={styles.introText}>
                Can't find your answer? Do not hesitate to contact us directly!
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
        paddingTop: 40,
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
    introTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#48c289',
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
