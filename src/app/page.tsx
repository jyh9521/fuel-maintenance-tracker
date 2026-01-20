import { VehicleList } from '@/components/VehicleList';
import { HomeHeader } from '@/components/HomeHeader';

export default function Home() {
  return (
    <main className="layout-container py-8">
      <HomeHeader />

      <section>
        <VehicleList />
      </section>
    </main>
  );
}
