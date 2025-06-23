import React from "react";
import Pricing from "../../components/pricing";
import Accordion from "../../components/ui/Accordion";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

const accordionItems = [
  {
    title: "What is the subscription plan?",
    content: "The subscription gives you extra features like faster support, highlighted listings, and more depending on the plan type."
  },
  {
    title: "How can I make a payment?",
    content: "You can pay using credit cards, bank transfers, or other available electronic payment methods."
  },
  {
    title: "Can I cancel my subscription?",
    content: "Yes, you can cancel your subscription anytime from your account settings. No further charges will apply."
  },
  {
    title: "Who can use the platform?",
    content: "The platform is designed for licensed pharmacists and pharmacy owners. Verification may be required upon registration."
  },
  {
    title: "Can I list an entire pharmacy for sale?",
    content: "Yes, the platform allows you to list your pharmacy for sale with full details, location, and images."
  },
  {
    title: "Is it safe to exchange near-expiry medicines?",
    content: "All users are verified, and the platform encourages safe, legal, and transparent exchange according to local regulations."
  },
  {
    title: "Do you offer support for advertisers?",
    content: "Yes, pharmaceutical companies can contact our support team to run targeted campaigns directly to our network of pharmacists."
  }
];

export default function Subscription() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <Pricing />
      <Card className="py-6 max-sm:mx-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-black m-auto">Frequently Asked Questions</CardTitle>
          <span className="text-center">Find answers to common questions about advertising with Dawaback</span>
        </CardHeader>
        <CardContent>
          <Accordion items={accordionItems} />
        </CardContent>
      </Card>
    </div>
  );
}
