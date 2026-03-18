export default function Activities() {

  return (
    <div className="bg-[#161922] p-5 rounded-xl">

      <h3 className="mb-4 font-semibold">
        Lesson Activities
      </h3>

      <div className="space-y-3 text-sm">

        <div className="flex justify-between">
          <span>Not Started</span>
          <span>125</span>
        </div>

        <div className="flex justify-between">
          <span>Completed</span>
          <span>75</span>
        </div>

        <div className="flex justify-between">
          <span>In Progress</span>
          <span>100</span>
        </div>

      </div>

    </div>
  );
}