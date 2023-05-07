import { library } from '@fortawesome/fontawesome-svg-core';
import initDemo from './demo';
export * from './components';

import { Bucket } from '@omegagrid/bucket';
import { Tree } from '@omegagrid/tree';
import { getStyleManager } from '@omegagrid/core';
import { Form } from '@omegagrid/form';
import { Tabs, TabContainer } from '@omegagrid/tabs';
// import { Code } from '@omegagrid/code';
// import { Editor } from '@omegagrid/editor';
// import { Toolbar } from '@omegagrid/toolbar';

// library.add(fas);

const OpenExile = {
    Tree,
    Form,
    Tabs,
    TabContainer,
    Bucket: Bucket,
    getStyleManager,
    initDemo,
    icons: library,
};

declare global {
    interface Window { 
        OpenExile: typeof OpenExile,
    }
}

window.OpenExile = OpenExile;