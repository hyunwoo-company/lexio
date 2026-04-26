import { RoomScreen } from '@/components/lobby/RoomScreen';

interface Props {
  params: Promise<{ roomId: string }>;
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params;
  return <RoomScreen roomId={roomId} />;
}
