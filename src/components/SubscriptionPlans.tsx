import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

interface Subscription {
  SubscriptionID: number;
  SubscriptionType: string;
  Price: number;
  BillingCycle: string;
  Features: string[];
}

async function getSubscriptions(): Promise<Subscription[]> {
  const res = await fetch('http://localhost:3000/api//mysql/subscriptions', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch subscriptions');
  }
  return res.json();
}

export default async function SubscriptionPlans() {
  const subscriptions = await getSubscriptions();

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">Choose Your Plan</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {subscriptions.map((subscription) => (
            <Card key={subscription.SubscriptionID} className="bg-gray-800">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-white">{subscription.SubscriptionType}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-center text-3xl font-bold text-white">
                  ${subscription.Price}/{subscription.BillingCycle === 'Monthly' ? 'mo' : 'yr'}
                </p>
                <ul className="space-y-2">
                  {subscription.Features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white">
                      <svg
                        className="mr-2 h-5 w-5 text-green-500"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Choose Plan</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

