export default function AssignmentCard(){

return(

<div className="bg-[#171A25] p-6 rounded-xl">

<p className="text-gray-400 text-sm">
Assignments
</p>

<div className="mt-4">

<div className="flex justify-between text-sm mb-1">

<span>Math</span>
<span>28%</span>

</div>

<div className="h-2 bg-gray-700 rounded">

<div className="bg-red-500 h-2 rounded w-[28%]"/>

</div>

</div>

</div>

)
}