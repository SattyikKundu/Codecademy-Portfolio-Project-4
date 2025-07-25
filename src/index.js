import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from '../src/App/App.js';
import store from "./utils/store/store.js";

const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
