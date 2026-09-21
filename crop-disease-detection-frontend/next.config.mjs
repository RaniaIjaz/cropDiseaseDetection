/** @type {import('next').NextConfig} */
// import {i8n} from './i18n.config.mjs'; 
import createNextIntPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntPlugin('./src/i18n/request.js');
const nextConfig = {};

export default withNextIntl(nextConfig);

// next.config.js

