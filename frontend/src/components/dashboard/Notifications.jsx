
// order Notes and timed Resources in this section? Day of or soon timed in Banners ?
function Notifications({ data, SetSuccess, SetLoading, SetNewFetch }) {

  return (
<div className="col-span-1 row-span-6 w-full flex">
      <div className="flex-1 p-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <ul className="mt-2">
          {data?.length === 0 || data !== undefined ? (
            <li className="text-gray-500">No notifications</li>
          ) : (
            data.map((notification) => (
              <li key={notification.id} className="border-b border-gray-200 py-2">
                {notification.message}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );

};

export default Notifications;