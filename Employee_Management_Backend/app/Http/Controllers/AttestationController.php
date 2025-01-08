<?php

namespace App\Http\Controllers;

use App\Models\Attestation;
use Illuminate\Http\Request;

class AttestationController extends Controller
{
    public function index(){
        $attestations=Attestation::with('user')->get();

        return response()->json($attestations);
    }


//creer une nouvelle demande
    public function store(Request $request){
        $validated=$request->validate([
'user_id' => 'required|exists:users,id'
        ]);

        $attestation = Attestation::create([
            'user_id' => $validated['user_id'],
            'status' => 'Pending',
        ]);
return response()->json(['message'=>'Demande enregistrée avec succès.']);
    }

    //update une demande
    public function updateStatus(Request $request, $id){
        $validated=$request->validate([
            'status'=>'required|in:Pending,Approved,Printed', 

        ]);
        $attestation=Attestation::findOrFail($id);
        $attestation->update(['status'=>$validated['status']]);
        return response()->json(['message'=>'Statut mis à jour avec succès']);

    }
    //suprimer une demande
public function destroy($id){
    $attestation=Attestation::findOrFail($id);
    $attestation->delete();
    return response()->json(['message'=>'Demande Suprrimee avec succès']);
}
}