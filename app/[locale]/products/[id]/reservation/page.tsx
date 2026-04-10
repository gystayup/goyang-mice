import ReservationPage, {
  generateMetadata,
} from "../../../../products/[id]/reservation/_page";

export { generateMetadata };

export default async function LocaleReservationPage(props: {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await props.params;

  return (
    <ReservationPage
      params={Promise.resolve({ id })}
      searchParams={props.searchParams}
    />
  );
}
