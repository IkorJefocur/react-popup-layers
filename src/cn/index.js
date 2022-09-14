import {withNaming} from '@bem-react/classname';
import namespace from './namespace';

export {namespace};
export default withNaming({n: namespace, e: '-', m: '_', v: '_'});