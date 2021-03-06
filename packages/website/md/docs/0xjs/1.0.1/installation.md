0x.js ships as both a [UMD](https://github.com/umdjs/umd) module and a [CommonJS](https://en.wikipedia.org/wiki/CommonJS) package.

#### CommonJS _(recommended)_:

**Install**

```bash
npm install 0x.js --save
```

**Import**

```javascript
import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
    SignerType,
} from '0x.js';
```

#### UMD:

**Install**

Download the UMD module from our [releases page](https://github.com/0xProject/0x-monorepo/releases) and add it to your project.

**Import**

```html
<script type="text/javascript" src="0x.js"></script>
```

### Wiki

Check out our [wiki](https://0x.org/wiki) for articles on how to get 0x.js setup with Ganache, Infura and more!
