import { useState } from 'react';
import { HomePage } from './Pages/HomePage';
import { MerchantPage } from './Pages/MerchantPage';
import { CustomerPage } from './Pages/CustomerPage';
import { SuccessPage } from './Pages/SuccessPage';

type AppPage = 'home' | 'merchant' | 'customer' | 'success';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'merchant':
        return <MerchantPage onNavigate={handleNavigate} />;
      case 'customer':
        return <CustomerPage onNavigate={handleNavigate} />;
      case 'success':
        return <SuccessPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentPage()}
    </div>
  );
}

export default App;