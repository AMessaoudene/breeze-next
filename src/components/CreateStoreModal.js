import { useState } from 'react';

const CreateStoreModal = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [template_id, setTemplateId] = useState('');
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const result = await onSubmit({ name, domain, template_id });
        if (result.success) {
            onClose();
        } else {
            setErrors(result.errors);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Store Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="domain">
                            Domain
                        </label>
                        <input
                            id="domain"
                            type="text"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.domain && <p className="text-red-500 text-xs italic">{errors.domain}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="templateId">
                            Template ID
                        </label>
                        <input
                            id="template_id"
                            type="text"
                            value={template_id}
                            onChange={(e) => setTemplateId(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {errors.template_id && <p className="text-red-500 text-xs italic">{errors.template_id}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStoreModal;
