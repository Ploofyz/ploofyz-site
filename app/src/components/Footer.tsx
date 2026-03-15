import { motion } from 'framer-motion';
import { ShoppingCart, ExternalLink, BookOpen, Gift, Map, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Grid */}
        <div className="footer-grid">
          {/* Play Now Column */}
          <div className="footer-column">
            <h3 className="footer-title">
              Play Now
              <span className="footer-dot" />
            </h3>
            <p className="footer-text">
              Start your journey today! Join the server now to play the best Minecraft adventure with quests, survival, and more!
            </p>
            <a 
              href="https://discord.gg/G7kZvTtHav" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-server-ip"
            >
              <span>play.ploofyz.com</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Links Column */}
          <div className="footer-column">
            <h3 className="footer-title">
              Links
              <span className="footer-dot" />
            </h3>
            <ul className="footer-links">
              <li>
                <a href="#/ranks" className="footer-link">
                  <BookOpen size={16} />
                  <span>Server Ranks</span>
                </a>
              </li>
              <li>
                <a href="#/vote" className="footer-link">
                  <Gift size={16} />
                  <span>Vote Rewards</span>
                </a>
              </li>
              <li>
                <a href="https://map.ploofyz.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <Map size={16} />
                  <span>Interactive Map</span>
                </a>
              </li>
              <li>
                <a href="https://discord.gg/G7kZvTtHav" target="_blank" rel="noopener noreferrer" className="footer-link">
                  <MessageSquare size={16} />
                  <span>Discord Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Store Column */}
          <div className="footer-column">
            <h3 className="footer-title">
              Store
              <span className="footer-dot" />
            </h3>
            <p className="footer-text">
              Check out our store to purchase ranks, crate keys, and more!
            </p>
            <a 
              href="https://ploofyz.tebex.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-store-btn"
            >
              <ShoppingCart size={16} />
              <span>Shop Now</span>
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Ploofyz &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <p className="footer-disclaimer">
            Not affiliated with Mojang or Microsoft.
          </p>
        </div>
      </div>
    </footer>
  );
}
