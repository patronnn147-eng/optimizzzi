@@ .. @@
                    <Link to={`/category/${category.id}`} className="hover:text-primary-500">{category.title}</Link>
                   </>
                 )}
                 <span>/</span>
                 <span className="text-gray-800 dark:text-gray-200">{displayProduct.name}</span>
               </nav>
               
               <Link
                 to="/products"
                 className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
               >
                 <ArrowLeft className="w-5 h-5 mr-2" />
                 Retour aux produits
               </Link>
             </div>
     
             {/* Détails du produit */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-12">
               <div className="grid lg:grid-cols-2 gap-8 p-8">
                 {/* Images */}
                 <div className="space-y-4">
                   <div className="relative">
                     <img
                       src={images[selectedImage] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'}
                       alt={displayProduct.name}
                       className="w-full h-96 object-cover rounded-2xl shadow-lg"
                     />
                     {displayProduct.discount > 0 && (
                       <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium flex items-center">
                         <Tag className="w-4 h-4 mr-1" />
                         -{displayProduct.discount}%
                       </div>
                     )}
                     {displayProduct.stockQuantity > 0 && displayProduct.stockQuantity < 10 && (
                       <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-lg font-medium">
                         Plus que {displayProduct.stockQuantity} en stock
                       </div>
                     )}
                     {displayProduct.stockQuantity > 0 && (
                       <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg font-medium">
                         {displayProduct.stockQuantity} en stock
                       </div>
                     )}
                   </div>
                   
                   {images.length > 1 && (
                     <div className="flex space-x-2">
                       {images.map((image, index) => (
                         <button
                           key={index}
                           onClick={() => setSelectedImage(index)}
                           className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                             selectedImage === index ? 'border-primary-500' : 'border-gray-200 dark:border-gray-600'
                           }`}
                         >
                           <img src={image} alt="" className="w-full h-full object-cover" />
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
     
                 {/* Infos du produit */}
                 <div className="space-y-6">
                   <div>
                     <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{displayProduct.name}</h1>
                     {category && (
                       <Link
                         to={`/category/${category.id}`}
                         className="text-primary-500 hover:text-primary-600 font-medium"
                       >
                         {category.title}
                       </Link>
                     )}
                     
                     {/* Fournisseur info */}
                     {displayProduct.fournisseurName && (
                       <div className="flex items-center gap-2 mt-3">
                         <Store className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                         <span className="text-lg text-neutral-700 dark:text-neutral-300 font-medium">
                           Vendu par {displayProduct.fournisseurName}
                         </span>
                       </div>
                     )}
                   </div>
     
                   {/* Évaluation */}
                   <ProductRating 
                     product={displayProduct} 
                     onProductUpdate={handleProductUpdate}
                     compact={true} 
                     showReviews={false} 
                   />
     
                   <div className="space-y-2">
                     <div className="flex items-center space-x-4">
                       {displayProduct.discount > 0 && (
                         <span className="text-2xl text-gray-500 dark:text-gray-400 line-through">
                           €{displayProduct.prixTTC.toFixed(2)}
                         </span>
                       )}
                       <span className="text-3xl font-bold text-primary-500">
                         €{discountedPrice.toFixed(2)}
                       </span>
                       <span className="text-gray-600 dark:text-gray-400">par {displayProduct.unit}</span>
                     </div>
                     <div className="text-sm text-gray-500 dark:text-gray-400">
                       Prix hors TVA : €{displayProduct.prixHTVA.toFixed(2)} (TVA : {displayProduct.tva}%)
                     </div>
                   </div>
     
                   <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{displayProduct.description}</p>
     
                   {displayProduct.Tags.length > 0 && (
                     <div className="flex flex-wrap gap-2">
                       {displayProduct.Tags.map((tag, index) => (
                         <span
                           key={index}
                           className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full text-sm font-medium"
                         >
                           {tag}
                         </span>
                       ))}
                     </div>
                   )}
     
                   <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                     <div className="flex items-center space-x-2">
                       <Clock className="w-4 h-4" />
                       <span>Prêt en 15-20 min</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <Shield className="w-4 h-4" />
                       <span>Qualité garantie</span>
                     </div>
                   </div>
     
                   {/* Quantité et Ajout au panier */}
                   <div className="space-y-4">
                     <div className="flex items-center space-x-4">
                       <span className="font-medium text-gray-700 dark:text-gray-300">Quantité :</span>
                       <div className="flex items-center space-x-2">
                         <button
                           onClick={() => setQuantity(Math.max(1, quantity - 1))}
                           className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                         >
                           <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                         </button>
                         <span className="w-12 text-center font-medium text-gray-800 dark:text-white">{quantity}</span>
                         <button
                           onClick={() => setQuantity(quantity + 1)}
                           className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                         >
                           <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                         </button>
                       </div>
                     </div>
     
                     <div className="flex space-x-4">
                       <button
                         onClick={handleAddToCart}
                         disabled={displayProduct.stockQuantity === 0}
                         className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <ShoppingCart className="w-5 h-5" />
                         <span>Ajouter au panier - €{(discountedPrice * quantity).toFixed(2)}</span>
                       </button>
                       <button className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                         <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                       </button>
                     </div>
     
                     {displayProduct.stockQuantity === 0 && (
                       <p className="text-red-500 font-medium">Cet article est actuellement en rupture de stock</p>
                     )}
                   </div>
                 </div>
               </div>
             </div>
     
             {/* Avis */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
               <ProductRating 
                 product={displayProduct} 
                 onProductUpdate={handleProductUpdate}
                 showReviews={true} 
               />
             </div>
     
             {/* Produits similaires */}
             {filteredRelatedProducts.length > 0 && (
               <div>
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                   Plus de <span className="text-primary-500">{category?.title}</span>
                 </h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {filteredRelatedProducts.map((relatedProduct) => (
                     <ProductCard key={relatedProduct.id} product={relatedProduct} />
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>
       );
     }
@@ .. @@
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      Profil
                    </Link>