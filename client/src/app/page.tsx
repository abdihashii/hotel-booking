import Block from '@/components/Block';

export default function Home() {
  return (
    <main className="w-3/4 mx-auto">
      <section className="grid grid-cols-2 gap-8 w-full">
        <Block blockName="Block A" />
        <Block blockName="Block B" />
        <Block blockName="Block C" />
        <Block blockName="Block D" />
      </section>
    </main>
  );
}
