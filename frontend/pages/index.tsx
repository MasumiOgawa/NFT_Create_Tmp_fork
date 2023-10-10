import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Image from 'next/image';
import Seo from './components/Seo';
import Header from './components/Header';
import Footer from './components/Footer';
import axios from "axios";


const Home: NextPage = () => {
  const [mintNum, setMintNum] = useState(0);
  const [mintQuantity, setmintQuantity] = useState(1);
  const [disabledFlag, setDisabledFlag] = useState(false);
  const [abi, setAbi] = useState<any[]>([]);
  const [items, setItems] = useState([]); // items ステートを追加
  const contractAddress = "0x42e4a3De5bb63e88b3E4eAE69f033Be7De93444a";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 1ページあたりのアイテム数

  useEffect(() => {
    const loadAbi = async () => {
      const response = await fetch('/nftABI.json');
      const abiData = await response.json();
      setAbi(abiData);
    };
    loadAbi();
  }, []);

  useEffect(() => {
    if (abi.length === 0) return;

    const setSaleInfo = async() => {
      const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
      const signer =  await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const userAddress = await signer.getAddress();
      console.log(userAddress);

      const nftCount = await contract.balanceOf(userAddress);
      console.log('mintCount='+nftCount);

      const tokenIds = await contract.tokensOfOwner(userAddress);
      for (let i = 0; i < tokenIds.length; i++) {
        const tokenId = tokenIds[i].toNumber();
    
        let tokenURI = 'https://bafybeid5fds5mdzuzk5gxotlkkcgck7tz4l3flyid54dde33lvprwia6yy.ipfs.nftstorage.link/' + tokenId + '.json';
        console.log(tokenURI);
        const meta = await axios.get(tokenURI);

        const name = meta.data.name;
        const description = meta.data.description;
        const imageURI = meta.data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');

        const item = {
          tokenId,
          name,
          description,
          tokenURI,
          imageURI
        }
        console.log(item);
        const [items, setItems] = useState<{ tokenId: any; name: any; description: any; tokenURI: string; imageURI: any; }[]>([]);
        // item を items に追加
        setItems(prevItems => [...prevItems, item]);
      }

      // 以下のコードはコメントアウト
      // ...
    };
    setSaleInfo();
  }, [abi]); // dependencies を指定

  const totalPages = Math.ceil(items.length / itemsPerPage);

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedItems = items.slice(indexOfFirstItem, indexOfLastItem);
  
  const NFTImage = ({ src, alt }) => {
    return (
      <div className="w-full h-96 md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg">
        <Image src={src} alt={alt} layout="fill" objectFit="cover" />
      </div>
    );
  };



  // ミントボタン用
  function MintButton() {
    async function addChain() {
      try{
        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
        });
        const provider = await new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setDisabledFlag(true);
      } catch(e) {
        console.log(e);
      }
      try{
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x13881',
            chainName: 'Mumbai Testnet',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 80001,
            },
            rpcUrls: ['https://polygon-mumbai.infura.io/v3/23ea2d926731400885b17ff8ce0ebbc2'],
          }],
        });
        console.log('try');
        setDisabledFlag(true);
      }catch(Exeption){
        console.log('Ethereum already Connected');
        console.log('catch');
      }finally{
        console.log('finally');
      }
    }
    const mintQuantityPlus = async () =>{
      if(mintQuantity == 3){
        return;
      } else {
        setmintQuantity(mintQuantity + 1);
      }
    };

    const mintQuantityMinus = async () =>{
      if(mintQuantity == 1){
        return;
      } else {
        setmintQuantity(mintQuantity - 1);
      }
    };
    
    const nftMint = async() => {
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      await provider.send('eth_requestAccounts', []);
      const tokenPrice = '0.01';
      const quantity = String(mintQuantity);
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try{
        await contract.mint(quantity,{value: ethers.utils.parseEther(tokenPrice),gasLimit: 91000});
        alert('Starting to execute a transaction');
      }catch(err: any) {
      // JSONへ変換
        const jsonData = JSON.stringify(err.reason);
        alert(jsonData);
      }
    };

    
    



    return <>
    <div className="bg-[#93c5fd] pb-16 flex flex-wrap buttom justify-center h-[1000px]" >
      <div className="top-image h-[300px]">
        <div className='px-8 pt-8 lg:px-28 lg:py-28'>
          <Image className="min-w-full" src="/14.png" alt="Main Image" width={300} height={300}/>
        </div>
      </div>
        {/* NFTミントエリア */}
      <div className = "mintarea">
        <div className="m-12 lg:m-32 px-12 py-6 lg:pt-8 lg:px-20 border-2 bg-[#737373] text-center border-[#FFFFFF] bg-center bg-contain bg-no-repeat">
          <h1 className="text-2xl lg:text-4xl pt-2 lg:pt-4 lg:pb-6 text-white font-['Impact']">お店の証明NFTを発行する</h1>
          <h1 className="text-2xl lg:text-4xl pt-2 lg:pt-4 lg:pb-6 text-white font-['Impact']"> {mintNum} / 100</h1>
          <a className="text-2xl lg:text-4xl pt-2 lg:pt-8 lg:pb-8 text-white font-['Impact']">1</a><a className="text-2xl lg:text-3xl pt-2 lg:pt-8 lg:pb-8 text-[#99CDDB] font-['Impact'] ">MAX</a><br/>
        
        { (!disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-1 lg:py-3 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border border-transparent
        bg-[#FFFFFF] border-yellow-200 font-['Impact'] text-[#99CDDB] hover:yellow-500 hover:bg-[#99CDDB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]
          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800" onClick={() => addChain()}>
        ウォレットに接続する</button>}
        { (disabledFlag) && <button type="button" className="text-xl lg:text-2xl py-1 lg:py-3 px-12 lg:px-24 inline-flex justify-center items-center gap-2 rounded-full border border-transparent
        bg-[#FFFFFF] border-yellow-200 font-['Impact'] text-[#99CDDB] hover:yellow-500 hover:bg-[#99CDDB] hover:text-[#FFFFFF] hover:border-[#FFFFFF]
          focus:outline-none focus:ring-2 focus:ring-yellow-200 focus:ring-offset-2 transition-all dark:focus:ring-offset-gray-800" onClick={() => nftMint()}>
        MINT NOW</button>}
        </div>
      </div>
      {/* ミントエリア */}
      <div> 
      <div>
      {

  
      items.map((item, i) => (
              <div key={i} className="flex justify-center pl-1 py-2 mb-1" >
                <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-l">
                <img className="md:h-auto object-cover  rounded-t-lg md:rounded-none md:rounded-l-lg" width={100} height={100} src={item.imageURI} alt="" />
                <div className="p-6 flex flex-col justify-start">
                  <h5 className="text-gray-900 text-xl font-medium mb-2">ブランド名：{item.name}</h5>
                    <p className="text-gray-700 text-base mb-4">
                        商品詳細：{item.description}
                    </p>
                 </div>
                </div>
              </div>
      ))
      }
     </div>
     
    </div>

    </div>
    </>
  }

  return (
    <div>
      <Seo
          pageTitle={'ETH MASKS'}
          pageDescription={'ETH MASKS'}
          pageImg={''}
          pageImgWidth={1920}
          pageImgHeight={1005}
      />
      <Header />
      <MintButton/>
      
      <Footer />
    </div>
    
  );
};

export default Home;