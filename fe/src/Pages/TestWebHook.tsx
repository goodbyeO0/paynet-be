import { WebhookForm } from '../components/WebhookForm';
import { OrderSimulator } from '../components/OrderSimulator';

function TestWebHook() {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="space-y-4">
                    <WebhookForm />
                    <OrderSimulator />
                </div>
            </div>
        </div>
    );
}

export default TestWebHook