import React from 'react';
import Routers from './Route';
import CustomizerProvider from './_helper/Customizer/CustomizerProvider';

const App = () => (
  <div className='App'>
    <CustomizerProvider>
      <Routers />
    </CustomizerProvider>
  </div>
);

export default App;
