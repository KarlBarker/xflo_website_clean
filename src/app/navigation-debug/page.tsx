import { getNavigationData, getNavigationDataFresh } from '@/lib/navigation';
import type { NavigationData, MegaMenuSection, MegaMenuLink } from '@/types/navigation';

export default async function NavigationDebugPage() {
  const cachedData = await getNavigationData();
  const freshData = await getNavigationDataFresh();

  // Find Growth Strategy links in both datasets
  const findGrowthStrategyLinks = (data: NavigationData) => {
    const growthSection = data.megaMenuData?.sections?.find((s: MegaMenuSection) => s.title === 'Growth Marketing');
    const growthStrategyLink = growthSection?.links?.find((l: MegaMenuLink) => l.title === 'Growth Strategy');
    return { growthSection, growthStrategyLink };
  };

  const cached = findGrowthStrategyLinks(cachedData);
  const fresh = findGrowthStrategyLinks(freshData);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Navigation Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cached Data */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Cached Data</h2>
          <div className="space-y-2">
            <p><strong>Use Mega Menu:</strong> {String(cachedData.settings.useMegaMenu)}</p>
            <p><strong>Growth Marketing Section exists:</strong> {String(!!cached.growthSection)}</p>
            {cached.growthSection && (
              <div className="ml-4">
                <p><strong>Section href:</strong> {cached.growthSection.href}</p>
                <p><strong>Links count:</strong> {cached.growthSection.links?.length || 0}</p>
              </div>
            )}
            <p><strong>Growth Strategy Link exists:</strong> {String(!!cached.growthStrategyLink)}</p>
            {cached.growthStrategyLink && (
              <div className="ml-4">
                <p><strong>Title:</strong> {cached.growthStrategyLink.title}</p>
                <p><strong>Href:</strong> {cached.growthStrategyLink.href}</p>
                <p><strong>Is Active:</strong> {String(cached.growthStrategyLink.isActive)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Fresh Data */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Fresh Data</h2>
          <div className="space-y-2">
            <p><strong>Use Mega Menu:</strong> {String(freshData.settings.useMegaMenu)}</p>
            <p><strong>Growth Marketing Section exists:</strong> {String(!!fresh.growthSection)}</p>
            {fresh.growthSection && (
              <div className="ml-4">
                <p><strong>Section href:</strong> {fresh.growthSection.href}</p>
                <p><strong>Links count:</strong> {fresh.growthSection.links?.length || 0}</p>
              </div>
            )}
            <p><strong>Growth Strategy Link exists:</strong> {String(!!fresh.growthStrategyLink)}</p>
            {fresh.growthStrategyLink && (
              <div className="ml-4">
                <p><strong>Title:</strong> {fresh.growthStrategyLink.title}</p>
                <p><strong>Href:</strong> {fresh.growthStrategyLink.href}</p>
                <p><strong>Is Active:</strong> {String(fresh.growthStrategyLink.isActive)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Growth Marketing Links */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">All Growth Marketing Links (Fresh Data)</h2>
        {fresh.growthSection?.links?.map((link: MegaMenuLink, index: number) => (
          <div key={index} className="flex justify-between items-center border-b border-gray-200 py-2">
            <span className="font-medium">{link.title}</span>
            <span className="text-sm text-gray-600">{link.href}</span>
            {link.isActive && <span className="text-green-600 font-semibold">Active</span>}
          </div>
        ))}
      </div>

      {/* Raw Data Comparison */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Raw Data Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Cached Growth Strategy</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
              {JSON.stringify(cached.growthStrategyLink, null, 2)}
            </pre>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fresh Growth Strategy</h3>
            <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
              {JSON.stringify(fresh.growthStrategyLink, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}