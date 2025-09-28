// Bundle analyzer utility to help identify large dependencies
import withBundleAnalyzer from '@next/bundle-analyzer';

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default analyzer;