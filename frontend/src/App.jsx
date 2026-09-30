import { useEffect, useState } from 'react';

import { RouterProvider } from 'react-router-dom';

import router from './routes/Router';

import Loader from './components/loader/Loader';

const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return <RouterProvider router={router} />;
};

export default App;
