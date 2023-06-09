import { json, redirect } from "@remix-run/node";
import consumersProvider from "../api/consumers";
import clientsProvider from "../api/clients";
import { getUser } from "~/session.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import ModifyConsumer from "../components/modals/ModifyConsumer";
import { safeRedirect } from "~/utils";
import AddConsumer from "../components/modals/AddConsumer";

export const meta = () => [{ title: "Utenti del cliente" }];

export async function loader({ request, params }) {
    const user = await getUser(request);
    const consumers = await consumersProvider.getAll(user.token, params.cid);
    const client = await clientsProvider.getById(user.token, params.cid);

    return json({ client, consumers });
}

export const action = async ({ request, params }) => {
    const user = await getUser(request);
    const formData = await request.formData();
    const { _action, ...values } = Object.fromEntries(formData)

    if (_action === "add") {
        const res = await consumersProvider.add(user.token, params.cid, values);
    }
    if (_action === "modify") {
        const res = await consumersProvider.modify(user.token, params.cid, values.consumerId, values);
    }
    if (_action === "remove") {
        const res = await consumersProvider.remove(user.token, params.cid, values.consumerId);
    }

    const redirectTo = safeRedirect(formData.get("redirectTo"), `/backoffice/clients/${params.cid}/consumers`);
    return redirect(redirectTo);
}

export default function BackofficeClientsCidConsumers() {
    const { client, consumers } = useLoaderData();

    return (
        <main className="relative">
            <div>
                <Link to="/backoffice/clients"><ion-icon name="arrow-back-outline" size="large"></ion-icon></Link>
                <div className="flex justify-between items-center">
                    <p className="py-6 text-2xl">Lista utenti del cliente {client.name}</p>
                    <AddConsumer client={client} />
                </div>

                <table className="w-full table-fixed">
                    <thead className="text-left bg-green-700">
                        <tr className="text-white text-xl">
                            <th>id</th>
                            <th>nome</th>
                            <th>descrizione</th>
                            <th>ruolo aziendale</th>
                            <th>email</th>
                            <th>mobile</th>
                            <th>autorizzato</th>
                            <th>azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {consumers.map((consumer, idx) =>
                            <tr key={idx}>
                                <td>{consumer.id}</td>
                                <td>{consumer.name ?? "-"}</td>
                                <td>{consumer.description ?? "-"}</td>
                                <td>{consumer.business_role.name ?? "-"}</td>
                                <td>{consumer.email ?? "-"}</td>
                                <td>{consumer.mobile ?? "-"}</td>
                                <td>{consumer.authorized ? "✔️" : "⭕"}</td>
                                <td className="flex items-center space-x-4">
                                    <ModifyConsumer consumer={consumer} />
                                    <Form method="post">
                                        <input name="consumerId" value={consumer.id} type="hidden" />
                                        <button name="_action" value="remove">
                                            <ion-icon name="trash-outline"></ion-icon>
                                        </button>
                                    </Form>
                                </td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

