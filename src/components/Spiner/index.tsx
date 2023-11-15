import { Spin } from 'antd';

import styles from './Spinner.module.scss';


const Spinner = () => <div className={ styles.spinner }><Spin size={ 'large' } /></div>;

export default Spinner;
