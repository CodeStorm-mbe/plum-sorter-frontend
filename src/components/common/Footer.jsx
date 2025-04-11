import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-background-dark py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <h3 className="font-title text-xl text-accent-gold">PlumSort<span className="text-accent-emerald">AI</span></h3>
                        <p className="mt-2 text-sm text-gray-400">
                            JCIA Hackathon 2025 - Tri Automatique des Prunes
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                        <Link to="/about" className="text-sm hover:text-accent-emerald transition-colors">À Propos</Link>
                        <a href="https://github.com/your-username/plum-sorter" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent-emerald transition-colors">
                            Code Source
                        </a>
                        <a href="https://kaggle.com/datasets/african-plums-dataset" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent-emerald transition-colors">
                            Dataset
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} PlumSortAI. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
