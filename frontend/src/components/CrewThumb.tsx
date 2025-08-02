type CrewThumbProps = {
  idx: number;
  imageUrl?: string | null;
  name: string;
};

const CrewThumb = ({ idx, imageUrl, name }: CrewThumbProps) => {
  return (
    <div key={idx} className="crew-item w-16 h-24 flex flex-col justify-center items-center gap-1">
      <img className="crew-image size-12 rounded-full" src={imageUrl ?? "https://placehold.co/48x48"} />
      <div className="crew-name text-black text-sm font-medium leading-tight">{name}</div>
    </div>
  )
}

export default CrewThumb